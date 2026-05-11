# TDJ Olympics Haxball

Portal oficial das **Olimpíadas TDJ Haxball** — o maior evento competitivo da comunidade TDJ no Haxball.

---

## Visão Geral

Este projeto é um portal web estilo eSports/Olimpíadas para acompanhar o torneio TDJ Olympics Haxball, com:

- Quadro de medalhas em tempo real
- Perfis das 9 delegações e seus atletas
- Resultados e placar ao vivo
- Ranking individual de jogadores
- 7 modalidades esportivas
- Painel administrativo para gestão do evento

---

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| **Next.js 14** (App Router) | Framework full-stack |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização utility-first |
| **Framer Motion** | Animações fluidas |
| **Supabase** | Banco de dados PostgreSQL + Auth |
| **Orbitron / Rajdhani / Inter** | Fontes Google |
| **Lucide React** | Ícones |

---

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
NEXT_PUBLIC_EVENT_DATE=2024-08-10T14:00:00
ADMIN_PASSWORD=sua_senha_aqui
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Configuração do Supabase

### 1. Criar projeto

Acesse [supabase.com](https://supabase.com) e crie um novo projeto.

### 2. Executar o schema

No SQL Editor do Supabase, execute o conteúdo de:

```
supabase/schema.sql
```

### 3. Popular dados iniciais

Execute também:

```
supabase/seed.sql
```

Isso irá inserir todos os países e atletas na base de dados.

---

## Deploy na Vercel

### 1. Push para GitHub

```bash
git init
git add .
git commit -m "Initial commit — TDJ Olympics Haxball"
git remote add origin https://github.com/seu-usuario/tdj-olympics.git
git push -u origin main
```

### 2. Deploy

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Import Project**
3. Selecione o repositório
4. Adicione as variáveis de ambiente
5. Clique em **Deploy**

---

## Estrutura do Projeto

```
olimpaidas-tdj-haxball/
├── app/
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Página Home
│   ├── globals.css             # Estilos globais
│   ├── delegacoes/
│   │   └── page.tsx            # Lista de delegações
│   ├── medalhas/
│   │   └── page.tsx            # Quadro de medalhas
│   ├── ranking/
│   │   └── page.tsx            # Ranking de jogadores
│   ├── modalidades/
│   │   ├── page.tsx            # Lista de modalidades
│   │   └── [id]/page.tsx       # Detalhe de modalidade
│   ├── partidas/
│   │   └── page.tsx            # Lista de partidas
│   ├── ao-vivo/
│   │   └── page.tsx            # Painel ao vivo
│   ├── historico/
│   │   └── page.tsx            # Histórico do evento
│   └── admin/
│       ├── layout.tsx          # Layout admin (auth)
│       └── page.tsx            # Dashboard admin
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── SectionHeader.tsx
│   │   └── LoadingScreen.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── Countdown.tsx
│   │   ├── DelegationsHighlight.tsx
│   │   ├── LatestResults.tsx
│   │   └── GeneralRanking.tsx
│   ├── delegacoes/
│   │   └── DelegationCard.tsx
│   ├── medalhas/
│   │   └── MedalTable.tsx
│   ├── ranking/
│   │   └── PlayerRankingTable.tsx
│   ├── modalidades/
│   │   └── ModalityCard.tsx
│   ├── partidas/
│   │   └── MatchCard.tsx
│   └── admin/
│       └── MatchForm.tsx
├── lib/
│   ├── utils.ts
│   ├── data/
│   │   ├── delegacoes.ts
│   │   ├── partidas.ts
│   │   └── modalidades.ts
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── types/
│   └── index.ts
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Funcionalidades

- **Home**: Hero animado, countdown até o evento, destaques de delegações, últimos resultados, mini quadro de medalhas
- **Delegações**: Cards interativos com todos os atletas, filtros e busca
- **Quadro de Medalhas**: Tabela ordenável (ouro, prata, bronze, total, pontos)
- **Ranking de Jogadores**: Estatísticas individuais, filtros por país e modalidade
- **Modalidades**: 7 modalidades com status, formato e detalhes
- **Partidas**: Filtros por status e modalidade, MatchCards com placares
- **Ao Vivo**: Placar em tempo real, próximas partidas
- **Histórico**: Linha do tempo da 1ª edição
- **Admin**: Dashboard protegido por senha, formulário de partidas

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'Add minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

Feito com ❤️ para a comunidade TDJ Haxball
