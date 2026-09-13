# 🧾 MENTORIA_STATE — Pokédex Angular 22

> Este arquivo é atualizado pelo mentor e pelo aluno ao longo do projeto.
> Não registrar “decisão” antes de ela realmente ser tomada.

## Projeto

- Nome: Pokédex Explorer
- Fonte de dados: PokéAPI
- Fase atual: 3 → 9 — MVP funcional concluído (HTTP, estados, cards, paginação, busca, filtro, rota de detalhe, mapper)
- Nível do aluno: A — começando (pouca ou nenhuma prática com Angular e consumo de API)

## Ambiente

- Node: v24.19.0
- npm: 11.17.0
- Angular CLI: 22.1.8
- SO: Windows x64
- Editor/agente: OpenCode
- Projeto criado: sim — `C:\Users\ALICE\IdeaProjects\pokedex-explorer`
- `ng serve`: ✅ validado — `npm start` → http://localhost:4200, watch mode ativo

## Decisões de produto

- Direção visual: **Catálogo Imersivo** (grid de cards, header ● POKÉDEX, numeração #0001, badges de tipo com texto + cor, fundo suave por tipo)
- Layout: **Catálogo Imersivo** — busca no topo, grid responsivo de cards, paginação Anterior/Próxima
- Comportamento mobile: pendente
- Tema: pendente
- Nome do projeto/repositório: **pokedex-explorer** (mentor propôs, aluno aprovou)
- Aparência: ✅ pass de design alinhado ao **Figma (White Theme)** aprovado pelo aluno — wordmark "● PokéDex", busca em pílula, detalhe com descrição/medidas/stats/habilidades/evolução
- Fundo: ✅ moldura Pokédex vermelha clássica (tampa + luzes + Pokébola em CSS, `app.scss`) + favicon `public/pokeball.svg` + wordmark corrigido "PokéDex **Explorer**"
- Base visual (referência do aluno): **Figma — "PokéDex (A PokeDex Website Design — Community)"**; estrutura extraída via OCR das screenshots exportadas pelo aluno
- Busca: global por nome/ID; **manual** (Enter/botão) no MVP; busca enquanto digita (debounce) = evolução posterior
- Filtro: global por tipo; **múltiplos tipos simultâneos (OR)**; aplicação **automática**; trocar tipo reseta a página para 1; "Todos" volta ao catálogo
- Paginação: obrigatória; apresentação pendente

## Decisões técnicas

- Arquitetura: **Page + Componentes + Service** (B) — UI em components/, página em pages/, API em core/; sem store/facade por enquanto
- Estrutura de pastas: intermediária — `core/services`, `models`, `components`, `pages` (criadas quando houver necessidade real)
- Estratégia de reatividade: **HttpClient + RxJS para rede**; **Signals para estado local de UI**; sem store global
- Estratégia de cards: N+1 aplicado no MVP — 12 detalhes por página via `forkJoin` (bulbasaur …) para exibir tipos no card; reavaliar adiante
- Estratégia N+1: aceita conscientemente no MVP (ver Dívidas técnicas)
- DTO → View Model: input direto da API para `PokemonCard`/`PokemonDetail` via `mapPokemonCard`/`mapPokemonDetail` (funções puras testadas)
- Cache: não introduzido
- Testes: ✅ Vitest — 11 testes (mapper 6, service 4, App 1), `npm run test -- --watch=false`

## ADRs leves

### ADR-001 — Direção visual da Pokédex

- Problema: escolher a direção visual com critérios de imersão (IHC), UX e fácil visualização.
- Opções: Clássica (dispositivo), Catálogo base, Híbrida (grid + painel), Catálogo Imersivo (reformulado), Híbrida Imersiva, Enciclopédia (lista vertical).
- Critérios: imersão, feedback/estado visível, affordance, hierarquia visual, Lei de Fitts, responsividade, viabilidade para nível A.
- Recomendação do mentor: **Catálogo Imersivo** — equilíbrio entre imersão, UX e didática, sem estado duplo.
- Escolha do aluno: seguir a recomendação do mentor.
- Motivo: identidade forte sem custo de complexidade; base evolui sem reescrever.
- Consequência: abrimos mão do "dispositivo" literal e do painel rápido; ambos adicionáveis depois.
- Reversibilidade: alta (é verniz visual; camada de dados não muda).

### ADR-002 — Semântica de busca e filtro

- Problema: definir como busca e filtro interagem com múltiplos filtros e quando os resultados atualizam.
- Opções: filtro OR x AND; múltiplos tipos x tipo+busca x geração; atualização automática x manual.
- Critérios: custo de requests, complexidade didática, não fechar portas de evolução.
- Recomendação do mentor: múltiplos tipos com **OR**, filtro **automático**, busca **manual** no MVP, combinação busca+filtro como evolução.
- Escolha do aluno: seguir a recomendação.
- Motivo: menor custo e complexidade; compatível com a PokéAPI (que não suporta consultas combinadas servidor-side).
- Consequência: por enquanto busca e filtro são modos independentes; cruzá-los exige filtro client-side e fica registrado como evolução.
- Reversibilidade: alta.

### ADR-003 — Base visual (Figma do aluno)

- Problema: qual layout usar como referência — o Catálogo Imersivo (ADR-001) ou o design do aluno no Figma.
- Opções: manter só o Catálogo Imersivo; seguir só o Figma; **mesclar** (estrutura do Figma + decisões de UX/API já tomadas).
- Critérios: respeitar a preferência visual do aluno sem descartar decisões já registradas (estados, OR, busca manual, DTO/mapper).
- Recomendação do mentor: **mesclar** — pegar do Figma: busca no topo ("search e.g. ditto or pikachu"), grid de cards (# + nome + arte + tipos), e detalhe com seções Height/Weight/Stats/Abilities/Evolution.
- Escolha do aluno: ✅ sim, confirmado — wireframe aprovado e textos em **português**
- Motivo: o Figma é a referência de produto do aluno; a camada de dados/UX continua igual.
- Consequência: o detalhe ganha seções extras além do MVP; o texto/card exibe número, nome e tipos (a descrição longa do Figma fica como evolução por causa do custo de dados).
- Reversibilidade: alta (afeta só template/estilo).
- Nota de execução: o layout previsto tinha busca no topo, grid de cards e detalhe com Height/Weight/Stats/Abilities — implementado (Altura/Peso em português, Evolução ficou fora do MVP por exigir end-point de espécies).

## Já aprendido

- O que são Node.js, npm e Angular CLI e qual papel cada um tem.
- Comandos de verificação de ambiente: `node -v`, `npm -v`, `ng version`.
- SPA pura (client-side rendering) vs SSR, e por que escolhemos SPA.
- O que é uma rota de detalhe e por que importa (deep link, refresh, voltar).
- `npm start` executa o script `start` (`ng serve`) usando o `ng` local do projeto.
- HTTP status code 200 = ok, 304 = modificado (cache), 404 = não encontrado — e como ver na aba Network.
- O que é N+1 e por que a PokéAPI obriga a buscar cada detalhe separadamente (futuro: cache/custom endpoint).
- `(ngSubmit)` no Angular impede a recarga do navegador (diferente de `(submit)` puro) — e `forkJoin([])` não emite nada (lista vazia precisa de tratamento).

## Evidências de validação

### Fase 0

- build: ✅ `ng build` concluído em ~7.9s → `dist/pokedex-explorer`
- app local: ✅ abriu em http://localhost:4200 (página de boas-vindas do Angular)
- console: ✅ sem erros (F12 → Console)

### Fase 0 ✓ concluída

- build: ✅
- app local: ✅
- console: ✅

### Fase 1

- wireframe escolhido: **Catálogo Imersivo** (Ref 1); mini-ADR de filtros registrada
- ADR: ADR-001 (direção visual) e ADR-002 (busca/filtro) criados

### API

- Network: ✅ aluno observou request no DevTools (status 304 por cache; conceito 2xx/3xx/4xx/5xx entendido)
- listagem: ✅ shape inspecionado — `count` (1351), `next`, `previous`, `results[]` (name + url); **sem imagem/tipos**
- detalhe: ✅ shape inspecionado — resposta ~290 KB; usamos só id, name, height, weight, types, abilities, stats, sprites
- erro: ✅ 404 tratado no frontend; estados loading/erro/vazio implementados
- **N+1 validado em produção:** 12 requests/página (forkJoin) para enriquecer cartões — aceito no MVP; aprimoramento = cache ou end-point customizado

### Funcionalidades

- paginação: ✅ Anterior/Próxima, página atual × total, desabilitado nas bordas; offset = (página−1)×12
- busca: ✅ manual (Enter/Botão) por nome ou ID; 404 → "Nenhum Pokémon encontrado"; Botão Limpar volta ao catálogo
- filtro: ✅ chips de tipo multi-seleção (OR), aplicação automática, desmarcar tudo volta ao catálogo, reseta página 1
- rota detalhe: ✅ `/pokemon/:id` com loading, erro e seções (descrição, altura, peso, stats, habilidades, evolução)
- deploy: ✅ GitHub Pages via Actions (`deploy.yml`) com SPA redirect (`404.html`) → https://levi-marcos.github.io/pokedex-explorer/

### Qualidade

- responsividade: ✅ grid `repeat(auto-fill, minmax(150px, 1fr))` + layout do detalhe 1 coluna < 820px
- teclado: ✅ busca dentro de `<form` (Enter), botões nativos, foco visível no card
- testes: ✅ 16 passando (mapper 9, service 4, App 1, PokedexPage busca 2) — `npm run test -- --watch=false`
- performance: ⚠️ N+1 12 requests/página aceito (ver Dívidas); imagem da arte 1 é `eager` (warning LCP resolvido)

## Dívidas técnicas aceitas conscientemente

Dívida: N+1 na listagem (12 detalhes por página via `forkJoin`).
Por que aceitamos: atender ao requisito de tipos no card sem montar infra maior; nível A e prazo curto.
Impacto: ~12 requests a mais por página inicial; latência perceptível em rede lenta.
Quando revisar: após o MVP, cogitar cache em memória do detalhe e/ou exibir tipos só na tela de detalhe.

Dívida: steam que motiva — seção "Evolução" do design não implementada.
Por que aceitamos: exige o end-point `/pokemon-species/{id}` e encadeamento extra; MVP prioriza lista/busca/filtro/detalhe.
Impacto: detalhe visualmente mais simples que o Figma.
Quando revisar: evolução pós-MVP.

Dívida: descrição no card da lista não exibida (só no detalhe).
Por que aceitamos: texto de descrição vive em `/pokemon-species/{id}` — exibir no card exigiria +1 request por card.
Impacto: cards sem a 4ª linha do Figma. Descrição aparece no detalhe.
Quando revisar: junto com a melhoria de N+1 (cache).

Formato:

```text
Dívida:
Por que aceitamos:
Impacto:
Quando revisar:
```

## Bugs conhecidos

- ~~Busca não exibia resultado~~ ✅ **corrigido**: `(submit)` no `<form>` recarregava a página; trocado por `(ngSubmit)` + `FormsModule`. Reproduzido em `pokedex.spec.ts`.
- ~~"Voltar ao catálogo" após busca inexistente não recarregava~~ ✅ **corrigido**: a busca não marcava `mode='search'` no caminho de erro, então `clearSearch` não recarregava; agora `mode` é setado no início da busca. Coberto por teste.
- ~~Lista vazia causava loading infinito~~ ✅ **corrigido**: `forkJoin([])` não emite; adicionado tratamento de `results.length === 0`. Coberto por teste.

## Pendências

- rodar `ng lint`/prettier se estiverem configurados (não há lint configurado no projeto — confirmar)
- decidir commit do MVP (aluno autoriza no próximo passo)
- próximo padrão de commit: PT-BR a partir do primeiro commit de feature

## Próxima decisão

**Fechar o MVP:** validação visual do aluno em http://localhost:4200 + liberação de commit.

## Último checkpoint

Fases 3–9 (MVP): build ✅ (`ng build` 3s), testes ✅ 11 passando, server ativo em http://localhost:4200 (200 OK). Aguardando confirmação visual do aluno (primeiro Pokémon da primeira página).

Finalização: 16/16 testes ✅, build ✅, design do Figma aplicado (tampa vermelha + favicon Pokébola + nome corrigido), README PT ✅, deploy GH Pages ✅ → link https://levi-marcos.github.io/pokedex-explorer/