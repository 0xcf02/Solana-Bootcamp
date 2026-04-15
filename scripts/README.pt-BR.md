[![npm version](https://img.shields.io/npm/v/@stbr/solana-lessons)](https://www.npmjs.com/package/@stbr/solana-lessons)
[![license](https://img.shields.io/npm/l/@stbr/solana-lessons)](LICENSE)

# Scripts de Bootcamp Solana

12 scripts TypeScript autocontidos que ensinam desenvolvimento Solana para desenvolvedores web2. Cada script é uma lição executável que demonstra um conceito fundamental, exibe saída colorida no terminal e leva de 2 a 5 minutos para acompanhar.

Os scripts 01-09 usam **@solana/kit** (web3.js 2.0). Os scripts 10-12 usam **@solana/web3.js 1.x** onde helpers nativos do Kit ainda não estão maduros (extensões Token-2022, Actions SDK, x402).

## Instalar via npm

Execute o tutor interativo sem clonar nada:

```bash
# Sem instalação — apenas experimente
npx @stbr/solana-lessons --lang pt-BR

# Ou instale globalmente e use o comando curto
npm install -g @stbr/solana-lessons
solana-lessons --lang pt-BR
```

Comandos:

```bash
solana-lessons --lang pt-BR                 # Menu interativo: escolha uma lição
solana-lessons --lang pt-BR list            # Listar todas as lições
solana-lessons --lang pt-BR tutorial 1      # Acompanhamento paginado da lição 01
solana-lessons --lang pt-BR show 1          # Dump não-interativo (pipe para less)
solana-lessons --lang pt-BR run 1           # Executar o script real da lição
solana-lessons --lang pt-BR 1               # Atalho: tutorial 1
```

> **Dica:** Se o seu sistema já está configurado em português (`LANG=pt_BR.UTF-8`), o idioma é detectado automaticamente — não precisa de `--lang`.

O tutor narra cada passo da lição com código syntax-highlighted. No final, oferece executar o script real contra `$RPC_URL` (padrão: `http://127.0.0.1:8899`). Substitua com `--rpc <url>` ou a variável de ambiente `RPC_URL`.

## Pré-requisitos

| Requisito | Versão | Verificar |
|---|---|---|
| Node.js | 20+ | `node -v` |
| Solana CLI | 2.x | `solana --version` |
| solana-test-validator | (incluso na CLI) | `solana-test-validator --version` |

## Início Rápido

```bash
# Clone e entre no diretório
cd lesson-scripts

# Instale as dependências
npm install

# Inicie um validador local em outro terminal
solana-test-validator

# Execute a primeira lição
npx tsx src/01-hello-solana.ts
```

## Guia dos Scripts

| # | Script | Conceitos | SDK | Tempo |
|---|---|---|---|---|
| 01 | `hello-solana` | Keypairs, saldos, airdrop, lamports | Kit | ~2 min |
| 02 | `send-sol` | Construir tx com transfer + memo, padrão `pipe()` | Kit | ~3 min |
| 03 | `atomic-transactions` | Atomicidade: rollback em falha multi-instrução | Kit | ~5 min |
| 04 | `create-token-manual` | Criar token passo a passo (instruções brutas) | Kit | ~5 min |
| 05 | `create-token-easy` | Criar token com helper de alto nível, ciclo completo | Kit | ~3 min |
| 06 | `tokens-and-transfers` | Criação de ATA, mintar tokens, transferência SPL em detalhes | Kit | ~5 min |
| 07 | `pdas-explained` | Derivação de PDA, prova de ATA como PDA | Kit | ~3 min |
| 08 | `cpis-in-action` | Cadeia de CPI a partir dos logs de transação | Kit | ~4 min |
| 09 | `priority-fees` | Compute budget, estimação de CU, taxas de prioridade | Kit | ~4 min |
| 10 | `token-extensions` | Token-2022: taxas de transferência + metadados on-chain | 1.x | ~5 min |
| 11 | `solana-actions` | Blinks: servidor Express servindo uma Action de gorjeta | 1.x | ~5 min |
| 12 | `x402-micropayments` | x402: pagamento por chamada de API com HTTP 402 | 1.x | ~3 min |

## Executando os Scripts

Cada script pode ser executado diretamente com `tsx` ou pelo atalho npm:

```bash
# Direto
npx tsx src/01-hello-solana.ts

# Atalho npm
npm run 01
```

Todos os scripts apontam para `http://127.0.0.1:8899` (validador local) por padrão. Substitua com variáveis de ambiente:

```bash
RPC_URL=https://api.devnet.solana.com npx tsx src/01-hello-solana.ts
```

## Detalhes dos Scripts

### 01 - Hello Solana

Gera keypairs, verifica saldos, faz airdrop de SOL e explica a relação lamports/SOL. A interação mais simples possível com a Solana.

**Conceitos-chave:** `generateKeyPairSigner()`, `getBalance`, airdrop, 1 SOL = 1.000.000.000 lamports.

```
╔══════════════════════════╗
║  Lesson 01: Hello Solana  ║
╚══════════════════════════╝

▸ Step 1: Generate two keypairs
  ✔ Generated Keypair A
  Address A: 7xKb...9fGh
  ✔ Generated Keypair B
  Address B: 3mNp...2qRs
```

### 02 - Send SOL

Constrói uma transação com transferência de SOL e instrução memo usando o padrão `pipe()` do Kit. Demonstra composição de transações.

**Conceitos-chave:** `pipe()`, `createTransaction`, `appendTransactionMessageInstruction`, transfer + memo em uma tx.

### 03 - Transações Atômicas

Constrói uma transação multi-instrução onde uma instrução falha intencionalmente, provando que todas as instruções fazem rollback atomicamente. Mostra a diferença entre caminhos de sucesso e falha.

**Conceitos-chave:** Atomicidade, simulação de transação, tratamento de erros, falha parcial = rollback total.

### 04 - Criar Token (Manual)

Cria um token SPL usando instruções brutas: alocar conta, inicializar mint, criar ATA, mintar tokens. Cada passo é explícito para que você veja o que os helpers de alto nível abstraem.

**Conceitos-chave:** `SystemProgram.createAccount`, `initializeMint`, mint authority, decimals, construção de instruções brutas.

### 05 - Criar Token (Fácil)

Mesmo resultado do 04, mas usando funções helper de alto nível. Compara as duas abordagens e demonstra o ciclo de vida completo do token: criar, mintar, verificar supply.

**Conceitos-chave:** Abstração com helpers vs instruções brutas, ciclo de vida do token, verificação de supply.

### 06 - Tokens e Transferências

Cria Associated Token Accounts (ATAs), minta tokens e transfere tokens SPL entre carteiras. Mergulho profundo no modelo de contas de token.

**Conceitos-chave:** ATAs, `getOrCreateAssociatedTokenAccount`, `mintTo`, `transfer`, token account vs mint account.

### 07 - PDAs Explicados

Deriva Program Derived Addresses e prova que ATAs são PDAs. Mostra como seeds + program ID produzem endereços deterministicamente sem chave privada.

**Conceitos-chave:** `findProgramAddress`, seeds, bump seed, ATAs como PDAs, derivação determinística.

### 08 - CPIs em Ação

Executa uma transação que dispara Cross-Program Invocations e analisa os logs da transação para mostrar a cadeia de chamadas entre programas.

**Conceitos-chave:** CPI, inner instructions, parsing de logs de programa, profundidade de instrução.

### 09 - Taxas de Prioridade

Estima uso de compute units via simulação, define limites de compute units e taxas de prioridade, e compara o landing de transações com e sem taxas de prioridade.

**Conceitos-chave:** `ComputeBudgetProgram`, `setComputeUnitLimit`, `setComputeUnitPrice`, simulação, estimação de CU.

### 10 - Extensões de Token (Token-2022)

Cria um mint Token-2022 com duas extensões habilitadas simultaneamente: TransferFeeConfig (taxa de protocolo de 1% com cap de 9 tokens) e MetadataPointer com metadados on-chain. Sem necessidade de Metaplex.

**Conceitos-chave:** `TOKEN_2022_PROGRAM_ID`, `ExtensionType`, `getMintLen`, taxas de transferência, metadados on-chain, `createInitializeTransferFeeConfigInstruction`.

### 11 - Solana Actions (Blinks)

Inicia um servidor Express que implementa a spec Solana Actions: GET retorna metadados da action, POST aceita um endereço de carteira e retorna uma transação de transferência não-assinada. O servidor é uma fábrica de transações — nunca guarda chaves privadas.

**Conceitos-chave:** Actions/Blinks, `actions.json`, endpoints GET/POST, `createPostResponse`, middleware CORS. Roda na porta 8080.

### 12 - Micropagamentos x402

Demonstra o protocolo x402 para pagamento por chamada de API usando respostas HTTP 402. Um servidor exige pagamento via status code 402, e o cliente paga com SOL para desbloquear o recurso.

**Conceitos-chave:** HTTP 402 Payment Required, micropagamentos, APIs pay-per-call, fluxo do protocolo x402.

## Notas sobre SDKs

| Scripts | SDK | Por quê |
|---|---|---|
| 01-09 | `@solana/kit` (web3.js 2.0) | Moderno, tree-shakable, type-safe. Usa `pipe()` para construção de transações, factory functions para RPC/airdrop/sendAndConfirm. |
| 10-12 | `@solana/web3.js` 1.x | Helpers de extensões Token-2022 (`@solana/spl-token`), o Actions SDK (`@solana/actions`) e ferramentas x402 esperam tipos legados `Transaction`/`Connection`. Esses scripts migrarão para o Kit quando o ecossistema alcançar. |

Ambos os SDKs coexistem no `package.json` sem conflito. Os imports são explícitos por script, então não há ambiguidade.

## Estrutura do Projeto

```
lesson-scripts/
  package.json           # Dependências + atalhos npm (01-12)
  tsconfig.json          # ESNext, NodeNext, strict mode
  src/
    helpers/
      config.ts          # RPC client, airdrop, sendAndConfirm factories (@solana/kit)
      display.ts         # Formatação do console: banner(), step(), success(), cores
    01-hello-solana.ts
    02-send-sol.ts
    03-atomic-transactions.ts
    04-create-token-manual.ts
    05-create-token-easy.ts
    06-tokens-and-transfers.ts
    07-pdas-explained.ts
    08-cpis-in-action.ts
    09-priority-fees.ts
    10-token-extensions.ts
    11-solana-actions.ts
    12-x402-micropayments.ts
```

## Desenvolvimento

```bash
# Verificar tipos em todos os scripts
npm run typecheck

# Executar testes
npm test
```

## Solução de Problemas

### Validador não está rodando

```
Error: fetch failed ... ECONNREFUSED 127.0.0.1:8899
```

Inicie o validador local:

```bash
solana-test-validator
```

Aguarde "Ledger location: ..." aparecer antes de executar os scripts.

### Airdrop falha

```
Error: airdrop request failed
```

O validador local pode ter ficado sem SOL ou o rate limit de airdrop foi atingido. Reinicie o validador:

```bash
solana-test-validator --reset
```

Na devnet, o airdrop tem rate limit. Aguarde alguns segundos e tente novamente, ou use `solana airdrop 2 <address> --url devnet` pela CLI.

### Porta 8080 já em uso (Script 11)

O script 11 inicia um servidor Express na porta 8080. Se a porta estiver ocupada:

```bash
# Encontre e encerre o processo usando a porta 8080
lsof -ti:8080 | xargs kill -9

# Ou defina uma porta diferente
PORT=3000 npx tsx src/11-solana-actions.ts
```

### Erros de resolução de módulo

Certifique-se de que as dependências foram instaladas:

```bash
npm install
```

Se o TypeScript reclamar sobre resolução de módulo, verifique se está usando Node.js 20+ (`node -v`). O projeto usa `"module": "NodeNext"` que requer Node 20+.

### Simulação de transação falha

Alguns scripts simulam transações que falham intencionalmente (ex: 03 - Transações Atômicas). Leia a saída do console — falhas marcadas com um X vermelho são esperadas e demonstram tratamento de erros.
