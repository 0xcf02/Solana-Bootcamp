# Playbook Completo para Hackatons Solana e Web3 — Do Problema ao Pitch

> Participar de um hackaton não é sobre construir uma startup perfeita em 48 horas.
> É sobre provar que você consegue resolver um problema real com tecnologia e convencer outras pessoas de que sua solução tem futuro.

---

## Sumário

1. [A Mentalidade Correta](#1-a-mentalidade-correta)
2. [Fase 1 — Ideação e Foco no Problema](#2-fase-1--ideação-e-foco-no-problema)
3. [Fase 2 — Formação do Dream Team](#3-fase-2--formação-do-dream-team)
4. [Fase 3 — O Mito do MVP](#4-fase-3--o-mito-do-mvp)
5. [Fase 4 — Arquitetura e Stack Tecnológico](#5-fase-4--arquitetura-e-stack-tecnológico)
6. [Fase 5 — UI/UX: Web3 Não Precisa Ser Feia](#6-fase-5--uiux-web3-não-precisa-ser-feia)
7. [Fase 6 — Git, GitHub, Segurança e Boas Práticas](#7-fase-6--git-github-segurança-e-boas-práticas)
8. [Fase 7 — Entrega e Pitch](#8-fase-7--entrega-e-pitch)
9. [Cronograma Sugerido](#9-cronograma-sugerido)
10. [Erros Comuns e Como Evitá-los](#10-erros-comuns-e-como-evitá-los)
11. [Recursos e Ferramentas Úteis](#11-recursos-e-ferramentas-úteis)
12. [Checklist Final do Aluno](#12-checklist-final-do-aluno)

---

## 1. A Mentalidade Correta

A diferença entre projetos vencedores e os que ficam pelo caminho quase nunca é a qualidade do código. É a **estratégia**, o **escopo** e a **apresentação**.

Três princípios que devem guiar cada decisão durante o hackaton:

| Princípio | O que significa na prática |
|-----------|---------------------------|
| **Foco implacável** | Uma funcionalidade que funciona vale mais que dez pela metade |
| **Visibilidade do progresso** | O usuário (e o jurado) precisam ver que algo aconteceu |
| **Narrativa > Código** | Sem uma boa história, o melhor código fica invisível |

---

## 2. Fase 1 — Ideação e Foco no Problema

### A Dor Antes da Solução

A maior armadilha em Web3 é construir uma **"solução em busca de um problema"**. Não coloque blockchain onde um banco de dados tradicional resolve melhor.

**Perguntas para validar sua ideia:**

- Existe uma pessoa real com esse problema hoje?
- Essa pessoa pagaria ou se inscreveria para resolver?
- A Solana (ou blockchain em geral) é *necessária* ou apenas *conveniente*?

### O Teste do "Por que Solana?"

Sua ideia **precisa** de pelo menos uma destas propriedades únicas da blockchain:

- **Descentralização** — sem intermediário controlando os dados ou os recursos
- **Transparência** — histórico imutável e auditável publicamente
- **Composabilidade** — integrar com outros protocolos DeFi sem pedir permissão
- **Velocidade + Custo** — transações em < 1 segundo por frações de centavo
- **Micropagamentos** — valores impossíveis de transacionar em redes tradicionais
- **Propriedade digital real** — NFTs, tokens, ativos que o usuário realmente possui

> Se a sua ideia pode ser feita perfeitamente na AWS com um banco SQL, ela não é para este hackaton.

### O Pitch de 1 Linha

Antes de escrever código, consiga formular:

```
Nós fazemos [X] para [público Y], usando Solana para tornar isso [10x mais rápido / barato / transparente / acessível].
```

Se não conseguir preencher essa frase de forma convincente, volte para o problema.

---

## 3. Fase 2 — Formação do Dream Team

Um time de 4 desenvolvedores backend geniais frequentemente perde para um time **equilibrado**. Os perfis complementares ideais:

| Perfil | Responsabilidade principal | Skills |
|--------|---------------------------|--------|
| **Arquiteto de Contratos** | Programa na blockchain — lógica on-chain, segurança | Rust, Anchor Framework |
| **Mago do Frontend/Integração** | Interface do usuário + ponte com a blockchain | TypeScript, React/Next.js, Wallet Adapter |
| **Especialista em UI/UX** | Design das telas, jornada do usuário, copywriting | Figma, Tailwind, visão de produto |
| **Hustler (Business/Pitch)** | Modelo de negócio, vídeo demo, slides, apresentação | Comunicação, Canva, entendimento de mercado |

> **Nota:** Em times menores, uma pessoa pode acumular papéis — mas o papel do Hustler nunca deve ser negligenciado. Pitch ganha hackaton.

---

## 4. Fase 3 — O Mito do MVP

Em um hackaton, você não constrói um MVP de verdade. Você constrói um **Protótipo de Demonstração** (Demo Prototype).

### Corte a Gordura

Defina o **Core Loop** — a sequência mínima de ações que demonstra o valor do seu produto.

**Exemplo para um Neobank na Solana:**
```
Conectar carteira → Ver saldo → Enviar SOL → Ver confirmação na blockchain
```

Funcionalidades como "Editar Perfil", "Histórico completo" e "Notificações" são distração para o hackaton.

### Estratégia do Mock

- Dados **falsos (mockados)** nas telas secundárias são aceitáveis
- A funcionalidade **principal** (aquela que usa a Solana) deve funcionar de verdade
- Jurados testam o caminho principal. Nunca o secundário.

### Priorização com MoSCoW

| Prioridade | Categoria | Ação |
|-----------|-----------|------|
| **Must have** | Core Loop completo | Construa primeiro, sem exceção |
| **Should have** | Melhora a experiência | Construa se sobrar tempo |
| **Could have** | Nice-to-have | Mencione no pitch como "roadmap" |
| **Won't have** | Fora do escopo | Explicitamente ignore |

---

## 5. Fase 4 — Arquitetura e Stack Tecnológico

Divida a aplicação em blocos claros para o time trabalhar em **paralelo sem conflitos**:

### Frontend (A Cara)

```
Framework:     Next.js (React) — padrão da indústria Solana
               Vue + Quasar — ótimo para prototipação rápida

UI Libraries:  Tailwind CSS — utilitário, rápido, sem CSS custom
               Shadcn/UI    — componentes prontos e bonitos
               Radix UI     — acessibilidade embutida

Deploy:        Vercel (grátis, CI/CD automático com GitHub)
               Netlify (alternativa)
```

### Integração Blockchain (A Ponte)

```
@solana/web3.js        — SDK principal para interagir com a rede
@solana/wallet-adapter — conexão padronizada com Phantom, Backpack, etc.
@coral-xyz/anchor      — client-side para consumir programas Anchor
```

### Backend Off-chain (O Suporte)

Nem tudo precisa estar na blockchain. Use o off-chain para o que faz sentido:

```
Banco de dados:    Supabase (PostgreSQL + Auth + Storage gratuito)
                   Firebase (alternativa NoSQL)

Armazenamento      Irys (antigo Bundlr) — dados permanentes no Arweave
descentralizado:   IPFS via Pinata — metadados de NFTs e imagens

Backend simples:   Node.js + Express / Fastify
                   Vercel Edge Functions (serverless, no mesmo repo)
```

### Smart Contracts — O Motor

```
Linguagem:     Rust
Framework:     Anchor — abstrai a burocracia do Solana nativo,
               traz verificações de segurança padrão, IDL automático

Rede de testes: Devnet (sempre) — nunca teste na Mainnet
Explorer:       https://explorer.solana.com/?cluster=devnet
```

### Diagrama de Arquitetura Típico

```
┌─────────────────────────────────────────────┐
│              USUÁRIO (Browser)               │
│                                             │
│  Next.js Frontend  ←──→  Wallet (Phantom)   │
│       │                        │            │
│       ▼                        ▼            │
│  Backend API         Solana Devnet          │
│  (Supabase /         (Anchor Program)       │
│   Node.js)                │                │
│                     Arweave / IPFS          │
└─────────────────────────────────────────────┘
```

---

## 6. Fase 5 — UI/UX: Web3 Não Precisa Ser Feia

O maior calcanhar de Aquiles da Web3 é a experiência do usuário. Projetos que parecem **produtos Web2 modernos** ganham pontos absurdos com os jurados.

### Regras de Ouro de UX para Web3

**1. Feedback Visual Constante**

A blockchain leva segundos para confirmar uma transação. O silêncio mata a confiança do usuário.

```
Fluxo correto de feedback:
[Clique] → Spinner: "Assinando transação..."
         → Toast: "Transação enviada. Aguardando confirmação..."
         → Toast verde: "Confirmado! Ver no Explorer →"
```

**2. Mensagens de Erro Humanas**

| Erro técnico | Mensagem para o usuário |
|---|---|
| `User rejected the request` | "Transação cancelada. Tente novamente quando quiser." |
| `Insufficient funds` | "Saldo insuficiente. Você precisa de pelo menos X SOL." |
| `Transaction simulation failed` | "Algo deu errado. Verifique os dados e tente novamente." |

**3. Links para o Explorer**

Sempre que uma transação ocorrer, mostre o link para o comprovante:

```typescript
const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;
// Exiba como: "Ver transação no Explorer →"
```

**4. Onboarding Suave**

Não assuma que o jurado tem SOL na Devnet. Adicione um botão "Pegar SOL de teste (Airdrop)" visível na tela inicial ou instrua no README.

**5. Mobile-first Thinking**

Carteiras como Phantom Mobile são muito usadas. Teste o layout em viewport de 375px.

---

## 7. Fase 6 — Git, GitHub, Segurança e Boas Práticas

Você não tem tempo para ter problemas de infraestrutura na hora H.

### Estrutura de Branches

```
main          ← código estável, sempre funciona
  ├── feat/contrato-token
  ├── feat/tela-dashboard
  ├── feat/wallet-connect
  └── fix/botao-enviar
```

**Regra de Ouro:** Ninguém faz commit direto na `main`. Pull Requests rápidos evitam que o código de um quebre o ambiente do outro às 3h da manhã.

### Setup Inicial do Repositório (faça isso no Dia 0)

```bash
# 1. Crie o repo no GitHub e clone
git clone https://github.com/seu-time/nome-do-projeto
cd nome-do-projeto

# 2. Crie o .gitignore ANTES de qualquer commit
# Inclua obrigatoriamente:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "id.json" >> .gitignore          # chave privada da carteira local
echo "node_modules/" >> .gitignore
echo ".anchor/" >> .gitignore
echo "target/" >> .gitignore          # artefatos de build do Rust

# 3. Commit inicial
git add .gitignore README.md
git commit -m "chore: setup inicial do projeto"
git push
```

### Segurança — O Mínimo Inegociável

| Risco | Como evitar |
|-------|-------------|
| Chave privada no repositório | `.gitignore` obrigatório desde o início |
| Variáveis de ambiente expostas | Use `.env.local` (Next.js) ou `dotenv` |
| Instrução sem verificação de signer | Use `Signer` e `has_one` no Anchor para validar quem assina |
| Overflow em aritmética | Use `checked_add`, `checked_sub` em Rust |
| Conta não inicializada sendo usada | Valide `is_initialized` ou use `init_if_needed` com cuidado |

### Commits Semânticos (Comunicação entre o Time)

```
feat:  nova funcionalidade
fix:   correção de bug
chore: tarefas de infraestrutura (configs, deps)
docs:  documentação
style: formatação, sem mudança de lógica
```

---

## 8. Fase 7 — Entrega e Pitch

O código pode estar perfeito, mas se a apresentação for ruim, vocês perdem.

### O README.md é o Currículo do Projeto

Um README bem feito faz a diferença. Estrutura recomendada:

```markdown
# Nome do Projeto
> Tagline em uma frase.

## O Problema
[2-3 linhas sobre a dor que o projeto resolve]

## A Solução
[Screenshot ou GIF do app funcionando]

## Como Rodar Localmente
1. Clone o repositório
2. `npm install`
3. Configure o `.env` (veja `.env.example`)
4. `npm run dev`

## Stack
- Frontend: Next.js + Tailwind
- Contratos: Anchor (Rust)
- Rede: Solana Devnet

## Time
[Nomes e links do GitHub/LinkedIn]
```

### O Vídeo Demo (máx. 3 minutos)

| Segmento | Tempo | Conteúdo |
|----------|-------|----------|
| Problema | 0:00 – 1:00 | Mostre a dor real. Use dados ou uma história. |
| Demo ao vivo | 1:00 – 2:30 | Mostre o app funcionando. Carteira aprovando transação. Explorer confirmando. |
| Visão + Time | 2:30 – 3:00 | Roadmap rápido e quem fez o projeto. |

> Grave com o app em tela cheia. Use Loom, OBS ou QuickTime. Legenda em inglês se o hackaton for internacional.

### Deploy Obrigatório

Jurados não querem rodar `npm install`. Eles querem clicar num link.

```
Frontend:  Vercel (conecte o GitHub, deploy automático a cada push)
           Netlify (alternativa)

Contratos: Devnet (endereço do programa no README)
```

### Os Critérios Típicos de Avaliação

| Critério | Peso típico | Como ganhar pontos |
|----------|------------|-------------------|
| Inovação / Criatividade | 25% | Problema real + ângulo único |
| Execução Técnica | 25% | App funcionando, contrato deployado |
| Experiência do Usuário | 20% | Design limpo, feedback claro, sem erros |
| Potencial de Mercado | 20% | Tamanho do mercado, modelo de negócio |
| Apresentação / Pitch | 10% | Clareza, vídeo de qualidade |

---

## 9. Cronograma Sugerido

### Hackaton de 48 Horas

| Hora | Atividade |
|------|-----------|
| H+0 | Kick-off, definição do problema, validação da ideia |
| H+2 | Setup do repositório, divisão de tarefas, wireframes no Figma |
| H+4 | Início do desenvolvimento (contrato + frontend em paralelo) |
| H+16 | Core Loop funcionando na Devnet — **checkpoint obrigatório** |
| H+30 | Features secundárias, polimento de UI, tratamento de erros |
| H+40 | Deploy na Vercel, gravação do vídeo demo, README |
| H+46 | Revisão final, submissão |
| H+48 | Apresentação / pitch ao vivo |

### Hackaton de 1 Semana

| Dia | Foco |
|-----|------|
| Dia 1 | Ideação, validação, setup, wireframes |
| Dia 2-3 | Desenvolvimento do contrato (Anchor) + telas base |
| Dia 4 | Integração frontend ↔ contrato, testes na Devnet |
| Dia 5 | Polimento de UI/UX, tratamento de erros, deploy |
| Dia 6 | Vídeo demo, README, slides, revisão |
| Dia 7 | Buffer para imprevistos + submissão |

> **Regra dos buffers:** Reserve sempre as últimas 10% do tempo para imprevistos. A rede pode estar lenta, o deploy pode falhar, o vídeo pode precisar de retake.

---

## 10. Erros Comuns e Como Evitá-los

### Anti-Patterns Clássicos

**"Vamos fazer tudo" (Feature Creep)**
- Sintoma: O time fica adicionando funcionalidades novas até as 2h da manhã do dia de entrega.
- Solução: Congele o escopo após as primeiras 6 horas. Documente ideias novas para depois.

**"Blockchain para tudo"**
- Sintoma: Guardar nome de usuário, avatar e preferências na blockchain.
- Solução: Use blockchain apenas para o que precisa ser imutável, público ou descentralizado.

**"A interface a gente faz no final"**
- Sintoma: App com funcionalidade mas sem design, entregue na última hora.
- Solução: O especialista de UI começa no Dia 1, não no Dia 2.

**"Não vou testar no Devnet, é só uma demo"**
- Sintoma: Erro ao vivo durante o pitch porque a transação falha.
- Solução: Todos os fluxos devem ser testados ao menos 3 vezes antes da apresentação.

**"README? A gente coloca depois"**
- Sintoma: Jurado não sabe como rodar o projeto, não testa, dá nota baixa.
- Solução: O README básico é escrito no Dia 1 e atualizado ao longo do projeto.

**"Vamos usar a Mainnet para impressionar"**
- Sintoma: Gas fees reais, risco de perder fundos, stress desnecessário.
- Solução: Devnet para o hackaton. Sempre. Sem exceção.

---

## 11. Recursos e Ferramentas Úteis

### Desenvolvimento Solana
- [Solana Docs](https://docs.solana.com) — documentação oficial
- [Anchor Book](https://book.anchor-lang.com) — guia completo do Anchor Framework
- [Solana Playground](https://beta.solpg.io) — IDE online para testar contratos sem setup local
- [Solana Faucet (Devnet)](https://faucet.solana.com) — SOL gratuito para testes

### Frontend & Integração
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) — conexão padronizada com carteiras
- [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) — scaffolding rápido

### UI/UX & Design
- [Figma](https://figma.com) — wireframes e protótipos (grátis)
- [Shadcn/UI](https://ui.shadcn.com) — componentes React prontos e acessíveis
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [Heroicons](https://heroicons.com) — ícones SVG gratuitos

### Deploy & Infraestrutura
- [Vercel](https://vercel.com) — deploy de frontend com GitHub integration
- [Supabase](https://supabase.com) — backend-as-a-service gratuito
- [Irys](https://irys.xyz) — armazenamento permanente (Arweave)

### Apresentação
- [Loom](https://loom.com) — gravação de tela para o vídeo demo
- [Canva](https://canva.com) — slides profissionais sem esforço

### Hackatons para ficar de olho
- [Colosseum](https://colosseum.org) — maior hackaton recorrente da Solana
- [Devfolio](https://devfolio.co) — plataforma com vários hackatons Web3
- [DoraHacks](https://dorahacks.io) — grants e hackatons cripto em geral
- [ETHGlobal](https://ethglobal.com) — para quem quiser explorar Ethereum também

---

## 12. Checklist Final do Aluno

Use essa lista antes de submeter o projeto:

### Produto
- [ ] Temos um problema real e a Solana é a ferramenta certa para ele?
- [ ] Reduzimos a ideia para apenas **1 funcionalidade principal** funcionando?
- [ ] O Core Loop foi testado na Devnet pelo menos 3 vezes?
- [ ] A interface avisa o usuário quando algo está carregando na blockchain?
- [ ] Os erros são tratados com mensagens humanas (sem códigos técnicos na tela)?
- [ ] Existe um link para o Explorer após cada transação?

### Time e Processo
- [ ] Cada membro do time tem um papel claro e não sobreposição de trabalho?
- [ ] Estamos usando branches e Pull Requests (ninguém comita direto na `main`)?
- [ ] O arquivo `.env` e chaves privadas estão no `.gitignore`?
- [ ] Os contratos usam `Signer` para validar quem executa cada instrução?

### Entrega
- [ ] O frontend está deployado e acessível por link (Vercel/Netlify)?
- [ ] O endereço do programa na Devnet está no README?
- [ ] O README tem instruções claras para rodar localmente?
- [ ] O vídeo de demo tem no máximo 3 minutos e mostra o produto funcionando?
- [ ] O vídeo mostra a carteira aprovando a transação e o Explorer confirmando?
- [ ] Temos uma frase clara explicando o problema + solução + por que Solana?

---

*Material preparado para o Solana Bootcamp — use, adapte e distribua livremente.*
