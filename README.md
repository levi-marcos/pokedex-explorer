# PokéDex Explorer

Uma Pokédex interativa construída com **Angular 22** e dados da **[PokéAPI](https://pokeapi.co/)**. Explore, busque, filtre e consulte os detalhes de qualquer Pokémon — com visual inspirado no design de "A PokeDex Website Design".

## 🚀 Demonstração

A aplicação está publicada no GitHub Pages:

**https://levi-marcos.github.io/pokedex-explorer/**

## ✨ Funcionalidades

- **Catálogo paginado** — 12 Pokémon por página, com cartões mostrando nº, arte oficial, nome e tipos.
- **Busca global** — por nome ou ID (ex.: `pikachu` ou `25`), com estado "não encontrado".
- **Filtro por tipo (OR)** — marque vários tipos para ver todos os Pokémon que sejam de um deles.
- **Página de detalhe** — `/pokemon/:id` com descrição, altura/peso (em m e kg), stats com barras, habilidades e evolução.
- **Estados de UI** — carregando, erro, vazio e não encontrado.
- **Design fiel ao Figma** — wordmark ● PokéDex, moldura vermelha clássica com Pokébola, favicon Pokébola.
- **Responsivo** — adaptado para desktop e celular.

## 🧱 Stack

- [Angular 22](https://angular.dev/) (standalone components, Signals, rotas)
- [RxJS](https://rxjs.dev/) (HTTP + composição de requisições)
- [PokéAPI](https://pokeapi.co/) (dados)
- [Vitest](https://vitest.dev/) (testes)

## 📁 Estrutura

```
src/app/
├── components/pokemon-card/   # cartão do catálogo
├── core/
│   └── pokemon-api.service.ts # comunicação com a PokéAPI
├── models/
│   └── pokemon.models.ts      # DTOs, View Models e funções puras (mapper)
├── pages/
│   ├── pokedex/               # catálogo (busca, filtro, paginação)
│   └── pokemon-detail/        # detalhe do Pokémon
├── app.ts / app.html / app.scss
└── app.routes.ts
```

## ▶️ Como rodar localmente

Pré-requisitos: **Node.js 22+** e **npm**.

```bash
# 1) Instalar dependências
npm install

# 2) Subir o servidor de desenvolvimento
npm start

# 3) Abrir
# http://localhost:4200
```

## 🧪 Testes

```bash
npm run test -- --watch=false
```

Os testes cobrem: mapeador de domínio (purê), service HTTP (com `HttpTestingController`) e fluxos de busca da página principal.

## 🏗️ Build de produção

```bash
ng build
```

## 📦 Deploy no GitHub Pages

O repositório usa **GitHub Actions** (`.github/workflows/deploy.yml`): a cada push na branch `main`/`master`, o projeto é compilado com `--base-href` adequado e publicado. Para o roteamento funcionar em URLs profundas, o app usa `public/404.html` + redirecionamento via `sessionStorage`.

## 📊 Dados e a "estratégia N+1"

A PokéAPI entrega a listagem sem imagens/tipos; o detalhe de cada Pokémon traz tudo, porém em resposta pesada (~290 KB). No MVP, buscamos o detalhe de cada card da página (12 requisições em paralelo via `forkJoin`). Isso está registrado como **dívida técnica consciente** — a evolução (cache em memória e/ou endpoint customizado) está no roadmap.
