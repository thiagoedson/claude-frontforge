# Contribuindo para Claude Frontforge

Obrigado por considerar contribuir com o Claude Frontforge! Este documento fornece diretrizes para contribuições.

## 🎯 Como Contribuir

### Reportar Bugs

Encontrou um bug? Abra uma issue com:

1. **Título descritivo**: "Hook de validação falha em arquivos .vue"
2. **Descrição detalhada**:
   - Passos para reproduzir
   - Comportamento esperado
   - Comportamento atual
   - Versão do Claude Code
   - Sistema operacional
3. **Exemplos de código** (se aplicável)
4. **Screenshots** (se aplicável)

**Template de Bug Report:**
```markdown
### Descrição
[Descrição clara do bug]

### Passos para Reproduzir
1. Execute `/claude-frontforge:init`
2. Crie arquivo Button.vue
3. Observe erro...

### Esperado
[O que deveria acontecer]

### Atual
[O que está acontecendo]

### Ambiente
- Claude Code: v1.0.0
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Node: v18.0.0
```

### Sugerir Melhorias

Tem uma ideia? Abra uma issue com:

1. **Título claro**: "Adicionar suporte para Tailwind CSS"
2. **Problema que resolve**: Qual dor isso resolve?
3. **Solução proposta**: Como funcionaria?
4. **Alternativas consideradas**: Outros approaches?
5. **Impacto**: Quem se beneficia?

### Contribuir com Código

#### 1. Fork e Clone

```bash
# Fork no GitHub primeiro, depois:
git clone https://github.com/SEU_USERNAME/claude-frontforge.git
cd claude-frontforge
```

#### 2. Crie uma Branch

```bash
# Feature
git checkout -b feature/nome-da-feature

# Bugfix
git checkout -b fix/nome-do-bug

# Documentação
git checkout -b docs/o-que-mudou
```

#### 3. Faça as Mudanças

```bash
# Edite os arquivos
# Teste as mudanças
npm run verify
```

#### 4. Commit

Use mensagens de commit semânticas:

```bash
# Features
git commit -m "feat: adicionar validação de Tailwind CSS"

# Bugfixes
git commit -m "fix: corrigir detecção de Next.js 14"

# Documentação
git commit -m "docs: adicionar exemplo de Vue 3"

# Refactoring
git commit -m "refactor: otimizar extração de componentes"

# Performance
git commit -m "perf: melhorar velocidade do metrics dashboard"
```

**Prefixos de Commit:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação apenas
- `style:` - Formatação (não afeta código)
- `refactor:` - Refatoração
- `perf:` - Melhoria de performance
- `test:` - Adição de testes
- `chore:` - Tarefas de manutenção

#### 5. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

No GitHub:
1. Abra Pull Request
2. Descreva as mudanças
3. Referencie issues relacionadas (`Fixes #123`)
4. Aguarde review

**Template de Pull Request:**
```markdown
## Descrição
[Descrição clara das mudanças]

## Motivação
[Por que esta mudança é necessária?]

## Mudanças
- [ ] Adicionado X
- [ ] Modificado Y
- [ ] Corrigido Z

## Testes
- [ ] Testado manualmente
- [ ] Adicionados testes automatizados
- [ ] `npm run verify` passa

## Screenshots
[Se aplicável]

## Checklist
- [ ] Código segue as convenções do projeto
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Sem erros de lint
- [ ] Commits são semânticos

Fixes #[número-da-issue]
```

## 📝 Convenções de Código

### JavaScript/Node.js

```javascript
// ✅ BOM
function analyzeSpacing(files, system) {
  if (!system?.spacingBase) {
    return { score: null, message: 'Sistema não define base' };
  }

  // Lógica clara e comentada
  const result = calculateScore(files, system.spacingBase);
  return result;
}

// ❌ EVITAR
function f(a,b){if(!b)return;let c=a.map(x=>x*2);return c}
```

**Regras:**
- Use `const`/`let`, não `var`
- Funções descritivas (`analyzeSpacing` não `as`)
- Comentários para lógica complexa
- Tratamento de erros apropriado
- Evite nested ternaries

### Markdown

```markdown
<!-- ✅ BOM -->
## Título Claro

Parágrafo descritivo com contexto.

```bash
# Exemplo executável
npm run verify
```

<!-- ❌ EVITAR -->
##titulo
texto sem contexto
`comando` sem bloco de código
```

### Estrutura de Arquivos

```
hooks/
├── nome-descritivo.js      # ✅ BOM
│   ├── JSDoc comments
│   ├── Exports nomeados
│   └── CLI support (if applicable)
└── x.js                    # ❌ EVITAR
```

## 🧪 Testando

### Testes Manuais

```bash
# Verificar instalação
npm run verify

# Testar scripts individuais
npm run detect-context
npm run generate-tokens . css
npm run extract-components
npm run metrics

# Testar comandos no Claude Code
/claude-frontforge:init
/claude-frontforge:metrics
```

### Testes Automatizados (futuro)

```bash
# Quando implementado
npm test
```

## 📚 Documentação

Ao adicionar funcionalidades:

1. **Atualizar README.md** - Seção relevante
2. **Atualizar CHANGELOG.md** - Nova entrada
3. **Criar/atualizar comando .md** - Se aplicável
4. **Adicionar exemplo** - Em `reference/examples/`
5. **Atualizar QUICK_START.md** - Se comando novo

### Exemplo de Documentação

```markdown
## Nova Feature: Validação de Tailwind

### Descrição
Valida uso de classes Tailwind contra configuração do projeto.

### Uso
```bash
/claude-frontforge:validate-tailwind
```

### Exemplo
[Código de exemplo]

### Configuração
[Como configurar]
```

## 🎨 Direções de Design

Ao adicionar novas direções:

1. Adicionar em `references/directions.md`
2. Atualizar `detect-context.js` com sinais
3. Criar exemplo em `reference/examples/`
4. Documentar no README.md

**Template:**
```markdown
### Nome da Direção

**Quando usar:** [Contexto específico]

**Características:**
- Foundation: [Cool/Warm/Neutral]
- Spacing: [Base e escala]
- Depth: [Strategy]
- Colors: [Paleta]

**Exemplo de uso:**
[Código exemplo]
```

## 🐛 Debug

### Problemas Comuns

**Hook não executando:**
```bash
# Verificar permissões
chmod +x hooks/*.js

# Testar manualmente
echo '{"tool_input":{"file_path":"test.tsx"}}' | node hooks/validate-frontforge.js
```

**Detecção de contexto incorreta:**
```bash
# Ver análise detalhada
DEBUG=1 npm run detect-context
```

**Métricas incorretas:**
```bash
# Ver arquivos analisados
VERBOSE=1 npm run metrics
```

## 🔄 Processo de Review

1. **Automated checks**: GitHub Actions (futuro)
2. **Code review**: Mantenedor revisa código
3. **Testing**: Testes manuais em diferentes ambientes
4. **Documentation**: Verifica docs atualizadas
5. **Merge**: Squash and merge (commits limpos)

### Critérios de Aprovação

- [ ] Código limpo e legível
- [ ] Sem breaking changes (ou justificados)
- [ ] Documentação completa
- [ ] Testes passando
- [ ] CHANGELOG.md atualizado
- [ ] Versionamento correto

## 📦 Releases

Apenas mantenedores:

```bash
# 1. Atualizar versão
# package.json, plugin.json, marketplace.json

# 2. Atualizar CHANGELOG.md

# 3. Commit e tag
git commit -m "chore: bump version to 2026.2.1.1200"
git tag -a v2026.2.1.1200 -m "Release v2026.2.1.1200"

# 4. Push
git push origin main --tags

# 5. Criar GitHub Release
```

## 🙏 Reconhecimento

Todos os contribuidores serão listados em:
- README.md (seção Contributors)
- Release notes
- CHANGELOG.md (quando aplicável)

## ❓ Dúvidas

- **Issues**: Para discussões gerais
- **Discussions**: Para ideias e RFCs
- **Email**: thiagoedson@cassonestudio.com.br (apenas para issues privadas)

## 📜 Código de Conduta

### Nosso Compromisso

Ambiente acolhedor e respeitoso para todos, independentemente de:
- Experiência técnica
- Identidade de gênero
- Orientação sexual
- Deficiência
- Aparência pessoal
- Raça
- Etnia
- Idade
- Religião

### Comportamentos Esperados

✅ **Sim:**
- Linguagem acolhedora e inclusiva
- Respeito por pontos de vista diferentes
- Aceitar críticas construtivas
- Focar no melhor para a comunidade
- Empatia com outros membros

❌ **Não:**
- Linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos
- Assédio público ou privado
- Publicar informações privadas sem permissão
- Conduta não profissional

### Aplicação

Violações podem resultar em:
1. Aviso
2. Ban temporário
3. Ban permanente

Reporte via: thiagoedson@cassonestudio.com.br

---

## 💚 Obrigado!

Cada contribuição, seja código, documentação, report de bugs ou sugestões, ajuda a tornar o Claude Frontforge melhor para todos!

Happy coding! 🚀
