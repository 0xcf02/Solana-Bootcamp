# � Solana Bootcamp

Bem-vindo ao Bootcamp de Solana! Este repositório contém tudo que você precisa para começar a desenvolver aplicações descentralizadas (dApps) na blockchain Solana.

## � Índice (Navegável)

**Início Rápido:**
- [� Pré-requisitos](#-pré-requisitos)
- [� Instalação](#-instalação)

**Desenvolvimento:**
- [⚙️ Configuração Inicial](#️-configuração-inicial)
- [� Rodando os Scripts](#-rodando-os-scripts)
- [� Conceitos Fundamentais](#-conceitos-fundamentais-da-solana)

**Seu Projeto:**
- [� Projeto Final: SuperBank Neobank](#-projeto-final-superbank-neobank)
- [� Recursos e Links](#-recursos-e-links-importantes)
- [� Projeto de Casa: Neobank](#-projeto-de-casa-construir-seu-próprio-neobank)

**Suporte:**
- [� Troubleshooting](#-troubleshooting)

---

## � Pré-requisitos

Antes de começar, certifique-se de que você tem:

- **Node.js 20+** (verifique com `node -v`)
- **npm ou yarn** instalado
- **Git** instalado
- Uma conta em **Phantom Wallet** ou outro navegador Web3 (veja links abaixo)
- **Terminal/Git Bash** (recomendado)
- **Rust** (veja Instalação abaixo)
- **Solana CLI** (veja Instalação abaixo)
- **Anchor CLI** (veja Instalação abaixo)
- **Surfpool CLI** *(Opcional - recomendado para melhor desenvolvimento local)*

---

## � Instalação

### ⚡ Instalação Rápida (Recomendado)

A forma mais rápida é instalar tudo com **um único comando**. Este instalador oficial da Solana configura todo o seu ambiente em uma só vez:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

Aguarde a conclusão. Você verá algo como:

```
Installed Versions:
Rust: rustc 1.91.1 (ed61e7d7e 2025-11-07)
Solana CLI: solana-cli 3.0.10 (src:96c3a851; feat:3604001754, client:Agave)
Anchor CLI: anchor-cli 0.32.1
Surfpool CLI: surfpool 0.12.0
Node.js: v24.10.0
Yarn: 1.22.1
```

**Verifique se tudo foi instalado:**

```bash
rustc --version && solana --version && anchor --version && surfpool --version && node --version && yarn --version
```

---

### ✋ Instalação Individual (Se a Rápida Falhar)

Se o instalador rápido encontrar problemas, você pode instalar cada ferramenta individualmente:

### 1️⃣ Instalando Rust

O Rust é necessário para compilar programas Solana.

```bash
# Instale o Rust usando rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Recarregue seu ambiente
. "$HOME/.cargo/env"

# Verifique a instalação
rustc --version
```

**Esperado:** `rustc 1.86.0` ou superior

---

### 2️⃣ Instalando Solana CLI

A CLI do Solana fornece todas as ferramentas necessárias para construir e fazer deploy de programas.

```bash
# Instale a Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Atualize seu PATH (se necessário)
# No Linux/WSL/Mac:
export PATH="/Users/test/.local/share/solana/install/active_release/bin:$PATH"

# No Windows (Git Bash), adicione ao seu .bashrc ou .zshrc:
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verifique a instalação
solana --version
```

**Esperado:** `solana-cli 2.x.x` ou superior

---

### 3️⃣ Instalando Anchor CLI

Anchor é um framework que simplifica o desenvolvimento de programas Solana em Rust.

**Opção A: Instalar com AVM (Recomendado)**

```bash
# Instale o Anchor Version Manager
cargo install --git https://github.com/solana-foundation/anchor avm --force

# Instale a versão mais recente do Anchor
avm install latest
avm use latest

# Verifique a instalação
anchor --version
```

**Opção B: Instalar Diretamente**

```bash
# Se AVM tiver problemas, instale direto do GitHub
cargo install --git https://github.com/solana-foundation/anchor anchor-cli --force

# Verifique
anchor --version
```

**Esperado:** `anchor-cli 0.30.x` ou superior

---

### 4️⃣ Instalando Surfpool CLI (Opcional mas Recomendado)

Surfpool é uma ferramenta de desenvolvimento local que substitui o `solana-test-validator` com mais features.

```bash
# Instale o Surfpool
curl -sL https://run.surfpool.run/ | bash

# Verifique a instalação
surfpool --version
```

**Esperado:** `surfpool 0.12.0` ou superior

---

### 5️⃣ Clonando o Repositório e Instalando Dependências

```bash
# Clone este repositório
git clone <url-do-repo>
cd solana-bootcamp

# Instale as dependências Node.js
npm install
```

---

## ⚙️ Configuração Inicial

### Configurar Cluster Solana

Defina qual cluster Solana você quer usar:

```bash
# Para localhost (local validator)
solana config set --url localhost

# Para Devnet (testnet público)
solana config set --url devnet

# Para Mainnet (produção - cuidado!)
solana config set --url mainnet-beta

# Verifique sua configuração
solana config get
```

### Criar ou Importar uma Carteira

```bash
# Gerar uma nova carteira (keypair)
solana-keygen new

# Ou importar uma carteira existente
solana-keygen recover

# Visualizar seu endereço público (address)
solana address

# Visualizar seu saldo
solana balance
```

### Conseguir SOL de Teste

**Para Devnet (testnet público):**

```bash
# Airdrop 2 SOL para sua carteira
solana airdrop 2 --url devnet

# Verifique o saldo
solana balance --url devnet
```

> ⚠️ **Nota:** Devnet tem limite de 5 SOL por airdrop. Se atingir o limite, use o [Faucet da Solana](https://faucet.solana.com/).

**Para Localhost (local validator):**

```bash
# O local validator já vem com SOL ilimitado, sem necessidade de airdrop
```

---

## � Rodando os Scripts

### Passo 1: Iniciar o Local Validator

Abra um **terminal separado** e execute:

```bash
# Opção A: Usar Surfpool (recomendado, se instalado)
surfpool start

# Opção B: Usar solana-test-validator (tradicional)
solana-test-validator
```

Deixe este terminal rodando durante todo o bootcamp.

### Passo 2: Rodar os Scripts

Em **outro terminal**, execute os scripts na ordem:

> **⚠️ Importante:** Certifique-se de estar dentro da pasta raiz do projeto antes de executar os comandos abaixo. Se estiver em outra pasta, navegue para ela com `cd caminho/para/solana-bootcamp`.

```bash
# 01 - Hello Solana (Conceitos básicos, keypairs, airdrop)
npx tsx src/01-hello-solana.ts

# 02 - Send SOL (Criar e enviar transações)
npx tsx src/02-send-sol.ts

# 03 - Atomic Transactions (Atomicidade e rollback)
npx tsx src/03-atomic-transactions.ts

# 04 - Create Token (Manual) (Criar SPL Token manualmente)
npx tsx src/04-create-token-manual.ts

# 05 - Create Token (Easy) (Criar SPL Token com helpers)
npx tsx src/05-create-token-easy.ts

# 06 - Tokens and Transfers (ATAs e transferências)
npx tsx src/06-tokens-and-transfers.ts

# 07 - PDAs Explained (Program Derived Addresses)
npx tsx src/07-pdas-explained.ts

# 08 - CPIs in Action (Cross-Program Invocations)
npx tsx src/08-cpis-in-action.ts

# 09 - Priority Fees (Taxas de prioridade)
npx tsx src/09-priority-fees.ts

# 10 - Token Extensions (Token-2022)
npx tsx src/10-token-extensions.ts

# 11 - Solana Actions (Blinks)
npx tsx src/11-solana-actions.ts

# 12 - x402 Micropayments (Micropagamentos)
npx tsx src/12-x402-micropayments.ts
```

> � **Dica:** Você também pode usar os atalhos npm (execute na raiz do projeto):
> ```bash
> npm run 01
> npm run 02
> # ... etc
> ```
> Se receber erro "npm ERR! code ENOENT", certifique-se de estar na pasta correta do projeto onde o `package.json` está localizado.

---

## � Conceitos Fundamentais da Solana

### � Keypairs e Wallets

Uma **keypair** é um par de chaves criptográficas: chave pública (seu endereço) e chave privada (seu segredo). Você usa a chave privada para assinar transações.

```typescript
import { generateKeyPairSigner } from '@solana/web3.js';

const keyPair = await generateKeyPairSigner();
console.log('Public Key:', keyPair.address);
```

### � Lamports e SOL

- **1 SOL = 1.000.000.000 lamports**
- Os saldos na blockchain são armazenados em lamports (unidade menor)

### � Transações

Uma **transação** é uma série de instruções executadas atomicamente. Se uma instrução falhar, toda a transação é revertida.

```typescript
import { createTransaction, pipe, transfer } from '@solana/web3.js';

const tx = await pipe(
  createTransaction(),
  (tx) => transfer(tx, { source, destination, amount })
);
```

### � PDA (Program Derived Address)

Um **PDA** é um endereço gerado deterministicamente usando:
- Uma seed (texto)
- Um program ID
- Um bump seed (número)

PDAs **não têm chave privada** - são controlados por programas Solana.

**Uso:** Armazenar dados associados a um programa, criar contas para tokens, etc.

```typescript
import { findProgramAddress } from '@solana/web3.js';

const [pda, bump] = await findProgramAddress(
  [Buffer.from('seed-text')],
  programId
);
```

### � SPL Token

**SPL** = Solana Program Library. Um SPL Token é um token customizado criado em Solana (semelhante a ERC-20 no Ethereum).

**Componentes:**
- **Mint Account:** Armazena metadados do token (supply, decimais, mint authority)
- **Token Account:** Armazena o saldo do token de um usuário
- **Associated Token Account (ATA):** Um token account associado a uma carteira (criado automaticamente)

```typescript
import { getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

// Criar ATA
const ata = await getOrCreateAssociatedTokenAccount(
  connection, payer, mint, owner
);

// Mintar tokens
await mintTo(connection, payer, mint, ata.address, mintAuthority, 1000000000);

// Transferir tokens
await transfer(connection, payer, fromAta, toAta, owner, 500000000);
```

### � CPI (Cross-Program Invocation)

Um **CPI** permite que um programa Solana chame outro programa. É como um contrato inteligente chamar outro contrato.

**Exemplo:** Seu programa chama o Token Program para transferir tokens.

```typescript
// Seu programa emite uma instrução que chama outro programa
const transferInstruction = createTransferInstruction(
  fromTokenAccount,
  toTokenAccount,
  owner,
  amount,
  [],
  TOKEN_PROGRAM_ID
);
```

### � Instruções

Uma **instrução** é uma chamada para um programa Solana. Cada instrução especifica:
- Qual programa executar
- Quais contas serão afetadas
- Quais dados passar para o programa

```typescript
// Exemplo: Instrução de transferência
const instruction = createTransferInstruction(
  source,        // Conta de origem
  destination,   // Conta de destino
  owner,         // Quem assina
  amount,        // Quantidade em lamports
  [],
  SYSTEM_PROGRAM_ID
);
```

### � Autoridades (Authorities)

Cada recurso (mint, token account) tem **authorities** que podem fazer ações específicas:
- **Mint Authority:** Pode criar novos tokens
- **Freeze Authority:** Pode congelar token accounts
- **Owner:** Possui a conta

---

## � Projeto Final: SuperBank Neobank

Seu projeto final será **construir um SuperBank** - um neobank completo na Solana!

### Features Necessárias:

✅ Conexão de carteira (Phantom/Backpack/Solflare)  
✅ Exibir saldo em SOL  
✅ Criar token customizado "SuperReal" (SREAL)  
✅ Mintar tokens  
✅ Transferir tokens entre wallets  
✅ Histórico de transações  
✅ Dashboard com saldos e links para Explorer  
✅ Notificações com toast  

### Instruções para Começar:

1. **Acesse o trynoah.ai** (a IA te ajudará a buildar!)

2. **Use este prompt:**

```
Build a fullstack Solana neobank app called "SuperBank" on devnet with the following features:

✓ Wallet connection (Phantom/Backpack/Solflare) with balance display
✓ Create a custom SPL token called "SuperReal" (symbol: SREAL, 9 decimals) with a "Create Token" button
✓ Mint tokens: input field for amount + "Mint" button that mints SREAL to the connected wallet
✓ Transfer tokens: input field for recipient address + amount + "Send" button that transfers SREAL between wallets (auto-creates the recipient's Associated Token Account if needed)
✓ Transaction history: show recent transactions with links to Solana Explorer (devnet)
✓ Dashboard showing: SOL balance, SREAL balance, mint address, and a "View on Explorer" link for each
✓ Design: clean dark theme, modern UI. The app should feel like a simple neobank – show balances prominently, make send/receive the primary actions.

After each transaction, show a toast notification with the transaction signature linked to explorer.solana.com (devnet).
```

3. **Acompanhe o processo:** Não apenas copie/cole! Entenda cada etapa:
   - Como conectar a carteira
   - Como criar tokens SPL
   - Como construir transações
   - Como exibir dados na UI

4. **Teste localmente** ou no devnet

---

## � Recursos e Links Importantes

### � Documentação Oficial

- **[Solana.com](https://solana.com)** - Site oficial da Solana
- **[Solana Docs](https://solana.com/docs)** - Documentação completa
- **[Solana CLI Basics](https://solana-com-docs.vercel.app/docs/intro/installation/solana-cli-basics)** - Guia da CLI

### � Ferramentas e Frameworks

- **[Anchor Framework](https://www.anchor-lang.com/)** - Framework para desenvolver programas Solana
- **[Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)** - Biblioteca JavaScript para Solana
- **[@solana/kit](https://github.com/solana-foundation/@solana/kit)** - SDK moderno (web3.js 2.0)

### � Faucets e Testnet

- **[Solana Faucet](https://faucet.solana.com/)** - Conseguir SOL de teste
- **[Devnet Explorer](https://explorer.solana.com/?cluster=devnet)** - Ver transações e contas

### � Tutoriais e Exemplos

- **[Solana Developers](https://solana.com/developers/templates)** - Templates oficiais
- **[Solana Skill](https://github.com/solana-foundation/solana-dev-skill)** - Skill de desenvolvimento
- **[Solana Lesson Scripts](https://github.com/solanabr/solana-lesson-scripts)** - Scripts de aula (PT-BR)
- **[Solana Bootcamp](https://github.com/0xcf02/Solana-Bootcamp)** - Repositório de bootcamp
- **[Pirate Bootcamp](https://github.com/solana-developers/pirate-bootcamp)** - Bootcamp pirata
- **[Solana Claude](https://github.com/solanabr/solana-claude)** - AI assistants para Solana

### �️ IDEs e Playground

- **[trynoah.ai](https://trynoah.ai)** - Playground para buildar dApps com IA
- **[Quasar](https://quasar-lang.com/docs)** - Linguagem para contratos inteligentes
- **[GitHub Codespaces](https://ideal-spoon-695q5j7v44qr2rj94.github.dev/)** - Ambiente de desenvolvimento online

### � Wallets

- **[Phantom Wallet](https://phantom.com/download)** - Download Phantom (recomendado)
- **[Backpack](https://backpack.app/)** - Wallet alternativa
- **[Solflare](https://solflare.com/)** - Wallet alternativa

---

## � Projeto de Casa: Construir seu Próprio Neobank

Após o bootcamp, você deve construir um neobank completo! Aqui está o guia:

### � Requisitos Mínimos:

**Parte 1: Setup (Dia 1)**
- [ ] Criar projeto com Anchor/Next.js/React
- [ ] Conectar carteira Phantom
- [ ] Exibir saldo em SOL

**Parte 2: Token (Dia 2)**
- [ ] Criar um SPL Token customizado
- [ ] Exibir mint address
- [ ] Interface para mintar tokens

**Parte 3: Transferências (Dia 3)**
- [ ] Permitir enviar tokens para outro endereço
- [ ] Validar endereços
- [ ] Criar ATAs automaticamente

**Parte 4: Dashboard (Dia 4)**
- [ ] Exibir histórico de transações
- [ ] Links para Solana Explorer
- [ ] Toast notifications

**Parte 5: Design (Dia 5)**
- [ ] UI dark theme moderna
- [ ] Layout responsivo
- [ ] UX intuitiva

### � Metodologia: VibeCoding

Use **vibecoding** para acelerar o desenvolvimento:

1. **Descreva** o que quer buildar em português natural
2. **Use IA** (trynoah.ai) para gerar código
3. **Acompanhe** cada etapa e entenda o que está acontecendo
4. **Teste** localmente no seu computador ou no devnet
5. **Refine** o código iterativamente

### � Checklist de Desenvolvimento:

```bash
# Clone ou crie um novo projeto
git init my-neobank
cd my-neobank

# Setup básico
npm init -y
npm install @solana/web3.js @solana/spl-token

# Criar estrutura
mkdir src
mkdir src/components
mkdir src/utils

# Começar a buildar!
# Use trynoah.ai com o prompt que você vai customizar
```

### � Arquitetura Recomendada:

```
my-neobank/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SendTokens.tsx
│   │   └── History.tsx
│   ├── utils/
│   │   ├── solana.ts (conexão)
│   │   ├── tokens.ts (operações com tokens)
│   │   └── explorer.ts (links para explorer)
│   └── App.tsx
├── package.json
└── README.md
```

### � Dicas Importantes:

1. **Sempre começa simples:** Funcionalidade > Beleza. Depois adiciona UI.
2. **Teste no devnet:** Antes de qualquer coisa, peça SOL de teste no faucet.
3. **Leia os erros:** Se algo quebrar, leia a mensagem de erro completa.
4. **Entenda o código:** Não copie/cole cegamente. Entenda cada linha.
5. **Versione com Git:** Faça commits frequentes. `git add .` → `git commit -m "feat: adiciona X"`
6. **Use o Explorer:** Sempre que fizer uma transação, veja ela no [Solana Explorer](https://explorer.solana.com/?cluster=devnet).

---

## � Troubleshooting

### Erro: "fetch failed ... ECONNREFUSED 127.0.0.1:8899"

Seu local validator não está rodando.

```bash
# Terminal 1: Inicie o validator
surfpool start
# ou
solana-test-validator

# Terminal 2: Rode seus scripts
npx tsx src/01-hello-solana.ts
```

### Erro: "airdrop request failed"

O airdrop atingiu o limite ou o validator não tem SOL.

```bash
# Resete o validator
solana-test-validator --reset

# Ou use o faucet da Solana no devnet
solana airdrop 2 --url devnet
```

### Erro: "Module not found"

```bash
# Instale as dependências
npm install

# Certifique-se de estar usando Node.js 20+
node -v
```

### Erro: "Port 8080 already in use"

O script 11 usa a porta 8080.

```bash
# Use outra porta
PORT=3000 npx tsx src/11-solana-actions.ts
```

---

## � Contato e Dúvidas

Se tiver dúvidas durante o bootcamp:
- Pergunte no chat de aula
- Consulte a [documentação da Solana](https://solana.com/docs)
- Procure no [GitHub Issues](https://github.com/solana-foundation) de projetos relevantes

---

## � Licença

Este projeto está licenciado sob a MIT License.

---

**Boa sorte no bootcamp! � Você vai fazer coisas incríveis na Solana!**

---

### � Próximos Passos

1. ✅ Instale as dependências (Rust, Solana CLI, Anchor)
2. ✅ Configure seu cluster (localhost ou devnet)
3. ✅ Clone este repositório e instale dependências
4. ✅ Rode o primeiro script (`npm run 01`)
5. ✅ Entenda cada conceito enquanto roda os scripts
6. ✅ Comece o projeto SuperBank após o bootcamp
7. ✅ Crie seu próprio neobank! �

