# Guia de Instalação e Publicação

## Para Usuários: Como instalar a skill

### Método 1: Via Marketplace (Recomendado)

```bash
# No Claude Code, execute:
/plugin marketplace add thiagoedson/claude-frontforge

# Depois, abra o menu de plugins:
/plugin menu

# Selecione "claude-frontforge" e instale
# Reinicie o Claude Code após a instalação
```

### Método 2: Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/thiagoedson/claude-frontforge.git

# Entre na pasta
cd claude-frontforge

# Copie os arquivos para a pasta do Claude Code
# No Windows:
xcopy /E /I .claude "%USERPROFILE%\.claude\skills\claude-frontforge"
xcopy /E /I .claude-plugin "%USERPROFILE%\.claude-plugin\claude-frontforge"

# No macOS/Linux:
mkdir -p ~/.claude/skills/claude-frontforge
cp -r .claude/* ~/.claude/skills/claude-frontforge/
mkdir -p ~/.claude-plugin/claude-frontforge
cp -r .claude-plugin/* ~/.claude-plugin/claude-frontforge/
cp -r hooks ~/.claude-plugin/claude-frontforge/

# Reinicie o Claude Code
```

### Verificação da Instalação

Após instalar, verifique se está funcionando:

```bash
# No Claude Code, execute:
/claude-frontforge:init

# Deve aparecer a mensagem da skill
```

---

## Para Desenvolvedores: Como publicar no Claude Code Marketplace

### Pré-requisitos

1. **Repositório GitHub público** ✅
2. **Estrutura correta de arquivos**:
   - `.claude/` - Comandos e skills
   - `.claude-plugin/` - Metadados do plugin
   - `hooks/` - Scripts de validação
   - `README.md` - Documentação
   - `LICENSE` - Licença MIT
   - `package.json` - Dependências

### Passos para Publicação

#### 1. Verificar Estrutura

Certifique-se que seu repositório tem esta estrutura:

```
claude-frontforge/
├── .claude/
│   ├── commands/
│   │   ├── init.md
│   │   ├── status.md
│   │   ├── audit.md
│   │   ├── extract.md
│   │   ├── generate-tokens.md
│   │   └── metrics.md
│   └── skills/
│       └── claude-frontforge/
│           ├── SKILL.md
│           └── references/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── hooks/
│   ├── hooks.json
│   ├── validate-frontforge.js
│   ├── validate-a11y.js
│   ├── detect-context.js
│   ├── generate-tokens.js
│   ├── extract-components.js
│   └── metrics-dashboard.js
├── reference/
│   └── examples/
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

#### 2. Configurar marketplace.json

Já está configurado em `.claude-plugin/marketplace.json`:

```json
{
  "name": "claude-frontforge",
  "metadata": {
    "description": "UX engineering for Claude Code..."
  },
  "owner": {
    "name": "Thiago Edson Pereira",
    "url": "https://github.com/thiagoedson"
  },
  "plugins": [{
    "name": "claude-frontforge",
    "version": "2026.1.16.1543",
    "source": "./",
    "category": "design",
    "homepage": "https://github.com/thiagoedson/claude-frontforge",
    "tags": ["design", "design-system", "ui", ...]
  }]
}
```

#### 3. Criar Release no GitHub

```bash
# Faça commit de todas as alterações
git add .
git commit -m "Add intelligent features: context detection, tokens, a11y, metrics"

# Crie uma tag para a versão
git tag -a v2026.1.16.1543 -m "Release with new intelligent features"

# Faça push do código e da tag
git push origin main
git push origin v2026.1.16.1543
```

#### 4. Criar GitHub Release

No GitHub:
1. Vá em "Releases" → "Draft a new release"
2. Escolha a tag `v2026.1.16.1543`
3. Título: "Claude Frontforge v2026.1.16.1543"
4. Descrição:
   ```markdown
   ## 🚀 New Features

   - 🧠 Intelligent Context Detection
   - 🎨 Automatic Token Generation
   - 📚 Component Pattern Learning
   - ♿ Accessibility Validation (WCAG 2.1)
   - 📊 Metrics Dashboard

   ## Installation

   ```bash
   /plugin marketplace add thiagoedson/claude-frontforge
   ```
   ```
5. Clique em "Publish release"

#### 5. Registrar no Claude Code Marketplace

Atualmente, o processo de registro no marketplace pode variar. Opções:

**Opção A: Via PR no repositório oficial**
- Faça um Pull Request no repositório oficial do Claude Code Marketplace
- Inclua seu `marketplace.json`

**Opção B: Instalação direta via GitHub**
Os usuários podem instalar diretamente:
```bash
/plugin marketplace add thiagoedson/claude-frontforge
```

#### 6. Tornar Scripts Executáveis (Unix/macOS)

Se estiver no macOS/Linux:

```bash
chmod +x hooks/*.js
chmod +x .githooks/pre-commit
```

---

## Estrutura de Versões

Use versionamento semântico baseado em data:

- `YYYY.MM.DD.HHMM` - Ex: `2026.01.16.1543`
- Ou semântico tradicional: `1.0.0`, `1.1.0`, `2.0.0`

Atualize a versão em:
- `package.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

---

## Checklist de Publicação

Antes de publicar, verifique:

- [ ] README.md está atualizado
- [ ] LICENSE existe (MIT)
- [ ] package.json configurado
- [ ] Versões consistentes em todos os arquivos
- [ ] .gitignore configurado
- [ ] Todos os comandos testados
- [ ] Scripts Node.js funcionando
- [ ] Exemplos na pasta reference/
- [ ] GitHub Actions configurado (opcional)
- [ ] Release notes preparadas
- [ ] Tag Git criada
- [ ] GitHub Release publicado

---

## Suporte

Para problemas ou dúvidas:
- GitHub Issues: https://github.com/thiagoedson/claude-frontforge/issues
- Documentação: https://github.com/thiagoedson/claude-frontforge#readme

---

## Atualização da Skill

Para publicar uma nova versão:

1. Atualize o código
2. Incremente a versão em todos os arquivos
3. Commit e push
4. Crie nova tag e release no GitHub
5. Usuários podem atualizar com:
   ```bash
   /plugin update claude-frontforge
   ```
