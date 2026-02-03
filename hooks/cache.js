#!/usr/bin/env node

/**
 * Sistema de Cache para Claude Frontforge
 * Evita reprocessamento de arquivos não modificados
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = '.frontforge';
const CACHE_FILE = 'cache.json';
const CACHE_VERSION = '1.0.0';

/**
 * Calcula hash MD5 de um arquivo
 */
function hashFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * Calcula hash de múltiplos arquivos
 */
function hashFiles(filePaths) {
  const hashes = filePaths.map(f => hashFile(f)).filter(Boolean);
  return crypto.createHash('md5').update(hashes.join('')).digest('hex');
}

/**
 * Carrega cache do disco
 */
function loadCache(projectRoot = process.cwd()) {
  const cachePath = path.join(projectRoot, CACHE_DIR, CACHE_FILE);

  try {
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));

      // Verifica versão do cache
      if (data.version !== CACHE_VERSION) {
        return { version: CACHE_VERSION, entries: {} };
      }

      return data;
    }
  } catch (error) {
    // Cache corrompido, recria
  }

  return { version: CACHE_VERSION, entries: {} };
}

/**
 * Salva cache no disco
 */
function saveCache(cache, projectRoot = process.cwd()) {
  const cacheDir = path.join(projectRoot, CACHE_DIR);
  const cachePath = path.join(cacheDir, CACHE_FILE);

  try {
    // Cria diretório se não existe
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    cache.updatedAt = new Date().toISOString();
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
    return true;
  } catch (error) {
    console.error('⚠️ Erro ao salvar cache:', error.message);
    return false;
  }
}

/**
 * Verifica se uma operação tem cache válido
 * @param {string} operation - Nome da operação (ex: 'generate-tokens')
 * @param {string[]} files - Arquivos envolvidos
 * @param {string} projectRoot - Raiz do projeto
 * @returns {{ valid: boolean, data: any }} - Cache válido e dados
 */
function checkCache(operation, files, projectRoot = process.cwd()) {
  const cache = loadCache(projectRoot);
  const currentHash = hashFiles(files);

  const entry = cache.entries[operation];

  if (entry && entry.hash === currentHash) {
    return { valid: true, data: entry.data };
  }

  return { valid: false, data: null, hash: currentHash };
}

/**
 * Atualiza cache para uma operação
 * @param {string} operation - Nome da operação
 * @param {string} hash - Hash dos arquivos
 * @param {any} data - Dados a armazenar
 * @param {string} projectRoot - Raiz do projeto
 */
function updateCache(operation, hash, data, projectRoot = process.cwd()) {
  const cache = loadCache(projectRoot);

  cache.entries[operation] = {
    hash,
    data,
    cachedAt: new Date().toISOString()
  };

  // Limpa entradas antigas (mais de 7 dias)
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  Object.keys(cache.entries).forEach(key => {
    const entry = cache.entries[key];
    if (entry.cachedAt) {
      const age = now - new Date(entry.cachedAt).getTime();
      if (age > maxAge) {
        delete cache.entries[key];
      }
    }
  });

  saveCache(cache, projectRoot);
}

/**
 * Limpa todo o cache
 */
function clearCache(projectRoot = process.cwd()) {
  const cachePath = path.join(projectRoot, CACHE_DIR, CACHE_FILE);

  try {
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return true;
    }
  } catch (error) {
    console.error('⚠️ Erro ao limpar cache:', error.message);
  }

  return false;
}

/**
 * Mostra estatísticas do cache
 */
function cacheStats(projectRoot = process.cwd()) {
  const cache = loadCache(projectRoot);
  const entries = Object.keys(cache.entries).length;

  return {
    version: cache.version,
    entries,
    updatedAt: cache.updatedAt,
    operations: Object.keys(cache.entries)
  };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'clear') {
    clearCache();
    console.log('✅ Cache limpo');
  } else if (command === 'stats') {
    const stats = cacheStats();
    console.log('📊 Cache Stats:');
    console.log(`  Versão: ${stats.version}`);
    console.log(`  Entradas: ${stats.entries}`);
    console.log(`  Atualizado: ${stats.updatedAt || 'N/A'}`);
    console.log(`  Operações: ${stats.operations.join(', ') || 'nenhuma'}`);
  } else {
    console.log('Uso: node cache.js [clear|stats]');
  }
}

module.exports = {
  hashFile,
  hashFiles,
  loadCache,
  saveCache,
  checkCache,
  updateCache,
  clearCache,
  cacheStats
};
