# ⚡ DESAFIO 02 — POKÉDEX INTERATIVA EM ANGULAR 22

> **Trilha prática orientada por mentor**  
> **Stack:** Angular 22 · TypeScript · SCSS · HTML Semântico · Angular Router · HttpClient · Signals/RxJS conforme decisão  
> **Fonte de dados:** PokéAPI — `https://pokeapi.co/api/v2/`  
> **Diretório sugerido:** `~/IdeaProjects/pokedex-<seu-nome>`  
> **Modo obrigatório:** Mentor Mode / Anti-Autopilot

---

# 0. Nota importante sobre a API

Neste desafio usaremos a **PokéAPI**, uma API pública/comunitária amplamente usada para dados de Pokémon.

Ela **não deve ser apresentada como uma API oficial da The Pokémon Company**.

Se o aluno usar a expressão “API oficial do Pokémon”, o mentor deve corrigir gentilmente o termo e seguir com a PokéAPI como fonte pública definida pelo desafio.

Base URL:

```text
https://pokeapi.co/api/v2/
```

Endpoints centrais:

```text
GET /pokemon?limit=12&offset=0
GET /pokemon/{id-or-name}
GET /type
GET /type/{name}
```

Extensões opcionais:

```text
GET /pokemon-species/{id-or-name}
GET /evolution-chain/{id}
GET /generation/{id}
```

Não introduzir endpoint opcional antes de existir requisito.

---

# 1. Objetivo pedagógico

Ao final, o aluno deve ser capaz de explicar e demonstrar:

- como uma SPA Angular consome uma API REST;
- como `HttpClient` funciona no fluxo do Angular;
- o papel de um service;
- a diferença entre DTO e modelo de apresentação;
- como tipar respostas sem usar `any` como atalho;
- loading, erro, vazio e sucesso;
- paginação por `limit`/`offset`;
- busca por nome ou ID;
- filtro por tipo;
- rotas parametrizadas;
- composição de Observables e/ou integração com Signals;
- responsividade;
- acessibilidade;
- leitura do DevTools/Network;
- impacto de múltiplas requests;
- critérios de teste e validação.

O projeto visual importa, mas o aprendizado de **dados remotos + arquitetura de frontend** é o eixo central.

---

# 2. Escopo funcional

## 2.1 MVP obrigatório

A Pokédex deve ter:

1. listagem paginada de Pokémon;
2. cards com pelo menos:
   - número/ID;
   - nome;
   - imagem quando disponível;
   - tipo(s) quando a estratégia de dados escolhida permitir;
3. estado de loading;
4. estado de erro;
5. estado vazio quando aplicável;
6. busca global por nome ou ID;
7. filtro global por tipo;
8. página/rota de detalhe;
9. detalhe com:
   - nome;
   - ID;
   - imagem;
   - tipos;
   - altura;
   - peso;
   - habilidades;
   - stats básicos;
10. responsividade;
11. navegação por teclado funcional;
12. sem erro no console;
13. pelo menos testes de uma regra pura e de uma chamada de service ou mapper.

## 2.2 Extras conscientes

Só depois do MVP:

- favoritos com `localStorage`;
- dark/light;
- filtro por geração;
- cadeia de evolução;
- autocomplete;
- infinite scroll;
- comparação de Pokémon;
- URL sincronizada com filtros;
- cache de detalhes;
- skeleton;
- animações;
- PWA.

O mentor deve perguntar:

> Qual problema ou objetivo de aprendizado este extra resolve?

Se a resposta for “porque fica profissional”, discutir custo antes de adicionar.

---

# 3. Regras do Mentor Mode

O tutor deve seguir `AGENTS.md` e `POKEDEX_MENTOR_PROTOCOL.md`.

Resumo obrigatório:

- um conceito principal por passo;
- uma decisão bloqueadora por vez;
- explicar antes de usar;
- wireframe antes de layout relevante;
- opção + prós/contras + recomendação;
- validação depois de mudança;
- checkpoint antes de avançar;
- registrar decisões em `MENTORIA_STATE.md`.

---

# 4. Resultado esperado do produto

Uma experiência de Pokédex que permita:

```text
abrir app
  ↓
ver Pokémon paginados
  ↓
buscar por nome/ID OU filtrar por tipo
  ↓
abrir um Pokémon
  ↓
ver dados detalhados
  ↓
voltar à exploração
```

O fluxo precisa ser compreensível mesmo sem efeitos visuais sofisticados.

---

# 5. Mapa macro de arquitetura — somente referência inicial

O mentor NÃO deve tratar este desenho como decisão fechada antes de explicá-lo.

```text
┌─────────────────────┐
│       Browser       │
└──────────┬──────────┘
           │ eventos
           ▼
┌─────────────────────┐
│   Pages/Components  │
│ UI + interação      │
└──────────┬──────────┘
           │ chama
           ▼
┌─────────────────────┐
│ PokemonApiService   │
│ HTTP + contratos    │
└──────────┬──────────┘
           │ GET
           ▼
┌─────────────────────┐
│      PokéAPI        │
└──────────┬──────────┘
           │ JSON
           ▼
┌─────────────────────┐
│ DTO / mapper/model  │
└──────────┬──────────┘
           │ dados úteis
           ▼
┌─────────────────────┐
│   UI renderizada    │
└─────────────────────┘
```

Decisão obrigatória da Fase 1: quão separadas devem ser as camadas neste projeto didático?

---

# 6. Critérios transversais

Durante TODAS as fases:

## Corretude

- sem erro conhecido ignorado;
- sem mascarar falha de rede;
- sem campos inventados.

## Aprendizado

- conceito central explicado;
- aluno participa de decisões.

## Simplicidade

- não criar abstração sem necessidade observável.

## UX

- feedback visível;
- estados assíncronos compreensíveis.

## Acessibilidade

- semântica;
- teclado;
- foco;
- labels;
- contraste.

## Performance

- medir antes de otimizar.

---

# 7. FASE 0 — Diagnóstico e setup

## Papel do mentor

Professor de ambiente e ferramentas.

## Objetivos

- verificar ambiente;
- criar projeto conscientemente;
- entender arquivos básicos;
- iniciar Git se desejado;
- rodar aplicação.

## Antes de comandos

Perguntar apenas o nível do aluno usando a mensagem inicial do protocolo.

Depois, verificar:

```bash
node -v
npm -v
ng version
```

O mentor deve explicar o que cada comando verifica.

## Criação sugerida

Antes de executar, explicar cada flag.

```bash
cd ~/IdeaProjects
ng new pokedex-<seu-nome> --style=scss --routing=true --ssr=false
```

Não assumir que esta é a única forma. Se o CLI atual apresentar prompts ou flags diferentes, o mentor deve adaptar ao ambiente real sem inventar resultado.

## Conceitos

- Node.js;
- npm;
- Angular CLI;
- workspace;
- componente;
- router;
- SCSS;
- servidor local;
- hot reload.

## Exploração obrigatória

Mostrar responsabilidade, em alto nível, de:

- `main.ts`;
- configuração da aplicação;
- `app.component.*`;
- `styles.scss`;
- `app.routes.ts` quando presente;
- `package.json`;
- `angular.json`.

## Validação

```bash
ng serve
```

Confirmar:

- app abre;
- console sem erro bloqueador;
- terminal sem falha de build.

## Checkpoint

> Se você quiser mudar uma rota, qual arquivo procuraria primeiro e por quê?

## Saída da fase

`MENTORIA_STATE.md` atualizado com nível do aluno e ambiente.

---

# 8. FASE 1 — Descoberta de produto, arquitetura e wireframes

## Papel do mentor

Facilitador de decisão + arquiteto + UX mentor.

## Objetivos

Decidir conscientemente:

- direção visual;
- layout principal;
- arquitetura mínima;
- estratégia de reatividade;
- estratégia inicial de cards;
- paginação;
- escopo do MVP.

## 8.1 Intenção visual

Perguntar:

```text
Qual direção você quer para a Pokédex?

A) Clássica — lembra o dispositivo vermelho.
B) Moderna — catálogo limpo em grid.
C) Híbrida — catálogo moderno com referências visuais da Pokédex.
```

Antes da pergunta, mostrar wireframes e explicar prós/contras.

### Wireframe A — Clássica

```text
┌───────────────────────────────────────────────────────┐
│ ● POKÉDEX                   [buscar__________] [⌕]    │
├──────────────────────┬────────────────────────────────┤
│                      │ Pokémon selecionado            │
│        IMAGEM        │ #025 Pikachu                  │
│                      │ [electric]                    │
│                      │ dados rápidos                 │
├──────────────────────┴────────────────────────────────┤
│ mini lista / navegação                               │
└───────────────────────────────────────────────────────┘
```

**Prós:** identidade forte, divertido.  
**Contras:** exige adaptação maior para mobile e catálogo amplo.

### Wireframe B — Catálogo

```text
┌───────────────────────────────────────────────────────┐
│ POKÉDEX   [buscar________________] [tipo ▾]           │
├───────────────────────────────────────────────────────┤
│ [#001] [#002] [#003] [#004]                         │
│ [img ] [img ] [img ] [img ]                         │
│ nome   nome   nome   nome                            │
│ tipos  tipos  tipos  tipos                           │
├───────────────────────────────────────────────────────┤
│ [Anterior]            1 / N             [Próxima]    │
└───────────────────────────────────────────────────────┘
```

**Prós:** simples, responsivo, foco no consumo de API.  
**Contras:** identidade menos “dispositivo”.

### Wireframe C — Híbrida

```text
┌───────────────────────────────────────────────────────┐
│ ● POKÉDEX [buscar____________] [tipo ▾]              │
├──────────────────────────┬────────────────────────────┤
│ GRID                     │ QUICK VIEW                 │
│ [001][002][003]          │ imagem                     │
│ [004][005][006]          │ nome / tipos               │
│ [007][008][009]          │ dados rápidos              │
│                          │ [detalhes →]                │
└──────────────────────────┴────────────────────────────┘
```

**Prós:** personalidade + produtividade.  
**Contras:** mais estado e mais complexidade responsiva.

### Recomendação padrão do mentor

Para foco em Angular/API, recomendar **B** no MVP e permitir evolução visual depois.

Registrar a escolha.

## 8.2 Arquitetura

Apresentar:

### Opção A — Tudo no componente

Prós: menos arquivos.  
Contras: mistura rede, transformação, estado e UI.

### Opção B — Page + componentes + service

Prós: responsabilidades claras sem exagero.  
Contras: mais arquivos.

### Opção C — Store/facade desde o início

Prós: escalável em app grande.  
Contras: conceitos extras sem necessidade garantida.

**Recomendação:** B.

## 8.3 Reatividade

Apresentar Signals e RxJS com critérios.

Recomendação inicial:

- `HttpClient` + RxJS para rede/composição;
- Signals para estado local simples;
- sem store global no MVP.

## 8.4 Mini ADR obrigatório

Registrar em `MENTORIA_STATE.md`:

```text
ADR — Base da Pokédex

Layout:
Arquitetura:
Reatividade:
pageSize inicial:
Busca:
Filtro:
Tema:
Trade-offs aceitos:
```

## Não avançar se

- layout ainda é totalmente indefinido;
- aluno não sabe por que service existe;
- arquitetura escolhida não foi registrada.

---

# 9. FASE 2 — Explorar a PokéAPI antes de codificar UI

## Papel do mentor

Professor de HTTP + investigador de dados.

## Objetivo

Entender a API real antes de modelá-la.

## 9.1 Chamada de lista

Usar navegador/DevTools/ferramenta local adequada:

```text
https://pokeapi.co/api/v2/pokemon?limit=12&offset=0
```

Observar:

- `count`;
- `next`;
- `previous`;
- `results`;
- `name`;
- `url`.

Perguntar:

> Temos imagem e tipos nessa resposta?

O aluno deve perceber que não.

## 9.2 Chamada de detalhe

```text
https://pokeapi.co/api/v2/pokemon/25
```

Localizar apenas o necessário:

- `id`;
- `name`;
- `height`;
- `weight`;
- `abilities`;
- `stats`;
- `types`;
- `sprites`.

Não copiar toda a resposta para interfaces sem necessidade.

## 9.3 DevTools/Network

Ensinar:

- URL;
- método;
- status;
- tempo;
- response;
- initiator quando útil.

## 9.4 Problema de enriquecimento do card

Desenhar:

```text
GET /pokemon?limit=12
        │
        ├─ item 1 → GET /pokemon/1
        ├─ item 2 → GET /pokemon/2
        ├─ ...
        └─ item 12 → GET /pokemon/12
```

Perguntar:

> Se aumentarmos a página para 60, o que acontece com o número de requests?

## Decisão obrigatória

Escolher:

- card mínimo primeiro;
- card enriquecido com requests de detalhe;
- outra estratégia justificada.

Recomendação didática: implementar card mínimo funcional e depois enriquecer.

## Validação

O aluno deve conseguir explicar:

- diferença lista/detalhe;
- por que uma API pode fornecer recursos resumidos;
- o que é N+1.

---

# 10. FASE 3 — HTTP no Angular

## Papel do mentor

Professor + pair programmer.

## Objetivo

Fazer a primeira request Angular com responsabilidade clara.

## 10.1 Configurar HTTP

Antes de alterar configuração, explicar:

- `HttpClient`;
- provider;
- injeção de dependência;
- service.

## Próximo arquivo sugerido

```text
src/app/core/services/pokemon-api.service.ts
```

O mentor deve explicar se `core/` faz sentido para a estrutura real escolhida. Não impor pasta só por moda.

## Primeira função

Começar apenas com lista.

Contrato conceitual:

```ts
getPokemonList(limit: number, offset: number)
```

Não implementar detalhe, type, species e cache de uma vez.

## Tipos iniciais

Criar somente contratos usados na lista.

Exemplo conceitual:

```ts
interface NamedApiResource {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}
```

O mentor deve perguntar:

> Por que `next` pode ser `null`?

## Validação

- request aparece no Network;
- resposta tipada;
- console sem erro;
- não há `any` desnecessário.

## Checkpoint

> Quem conhece a URL base: o card ou o service? Por quê?

---

# 11. FASE 4 — Estado remoto: loading, erro e sucesso

## Papel do mentor

Professor de estado assíncrono.

## Objetivo

Evitar UI que só funciona em caminho feliz.

## Modelo mental

```text
idle
  ↓
loading
  ├─ success
  └─ error
```

Se houver lista vazia legítima:

```text
success
  ├─ with data
  └─ empty
```

## Decisão

Como representar estado?

A) vários Signals simples;  
B) objeto único com status;  
C) RxJS puro no template;  
D) abstração de resource se o ambiente atual suportar e o aluno quiser estudá-la.

O mentor deve explicar, recomendar e só então implementar.

## Requisito

Erro não pode virar `[]` silenciosamente.

## Wireframe de estados

### Loading

```text
┌──────────────────────────┐
│ Carregando Pokémon...    │
│ [skeleton] [skeleton]    │
└──────────────────────────┘
```

### Erro

```text
┌──────────────────────────┐
│ Não foi possível carregar│
│ [Tentar novamente]       │
└──────────────────────────┘
```

### Vazio

```text
┌──────────────────────────┐
│ Nenhum Pokémon encontrado│
│ [Limpar filtros]         │
└──────────────────────────┘
```

## Validação

Simular ou provocar erro de forma controlada antes de declarar fase concluída.

---

# 12. FASE 5 — Lista e cards

## Papel do mentor

Pair programmer + UX mentor.

## Objetivo

Renderizar Pokémon vindos da API.

## Antes do componente

Desenhar o wireframe exato do card escolhido.

Exemplo:

```text
┌─────────────────────┐
│ #0025               │
│       [imagem]      │
│ Pikachu             │
│ [electric]          │
│ Ver detalhes →      │
└─────────────────────┘
```

## Conceitos

- `@for`;
- `track`;
- interpolação;
- property binding;
- link semântico;
- Grid;
- alt text;
- fallback de imagem.

## Decisão N+1

Se card tiver tipo/imagem que exigem detalhe, implementar conscientemente.

Opção possível para página pequena:

```text
lista
  ↓
ids/urls
  ↓
forkJoin(detalhes dos 12)
  ↓
map para PokemonCardModel[]
```

O mentor deve explicar `forkJoin` antes de usar.

Não introduzir `forkJoin` se a estratégia escolhida não precisar.

## Checkpoint

> Se uma das 12 requests falhar, qual deve ser o comportamento? Queremos falha total ou tolerância parcial?

Apresentar trade-offs antes de escolher.

---

# 13. FASE 6 — Paginação

## Papel do mentor

Professor de estado derivado + UX.

## Objetivo

Navegar pelo catálogo sem baixar tudo.

## Conceitos

```text
pageSize = 12
page = 1
offset = (page - 1) * pageSize
```

Pergunta de previsão:

> Na página 4, com 12 itens por página, qual é o offset?

Resposta esperada: `36`.

## Comportamento obrigatório

- Próxima;
- Anterior;
- Anterior disabled na primeira;
- respeitar total;
- loading durante troca;
- foco/scroll coerente;
- não duplicar itens.

## Decisão

Botões ou números de página?

A) Anterior/Próxima;  
B) numeração;  
C) ambos.

Recomendação MVP: A.

## Teste útil

Função de cálculo de offset ou regra de habilitação.

---

# 14. FASE 7 — Busca global por nome ou ID

## Papel do mentor

Professor de API + estados de erro.

## Requisito semântico

A busca deve consultar o catálogo global, não apenas a página atual.

## Endpoint

```text
GET /pokemon/{id-or-name}
```

## UX a decidir

### Opção A — submit

Usuário digita e pressiona Enter/botão.

Prós: simples, poucas requests.  
Contras: menos fluido.

### Opção B — busca enquanto digita

Prós: rápida.  
Contras: exige debounce, cancelamento e regra para query curta.

### Recomendação MVP

A.

Depois, como extensão didática, evoluir para B com:

- `debounceTime`;
- `distinctUntilChanged`;
- `switchMap`.

## Normalização

Discutir:

- trim;
- lowercase;
- números;
- query vazia.

## Estados

- loading;
- encontrado;
- 404;
- erro de rede.

## Wireframe

```text
[ Pikachu________________ ] [Buscar]

resultado:
┌─────────────────────────┐
│ #0025 Pikachu           │
│ [imagem]                │
│ [electric]              │
│ [Abrir detalhes]        │
└─────────────────────────┘
```

## Critério de aceite

- “pikachu” encontra Pikachu;
- “25” encontra Pikachu;
- nome inexistente mostra mensagem específica;
- query vazia não faz request inútil.

---

# 15. FASE 8 — Filtro global por tipo

## Papel do mentor

Professor de semântica de filtro + integração de API.

## Primeiro conceito

Filtrar `cardsDaPagina` é diferente de filtrar “todos os Pokémon do tipo fogo”.

O aluno deve escolher conscientemente.

## Requisito do desafio

Filtro **global** por tipo.

## Endpoints

```text
GET /type
GET /type/{name}
```

## Comportamentos a decidir

- “Todos”;
- reset da página ao trocar tipo;
- como paginar resultados do endpoint de tipo;
- interação com busca;
- URL refletindo filtro ou não.

## Recomendação MVP

- busca e filtro são modos de exploração separados;
- trocar tipo reseta a página;
- “Todos” volta para listagem padrão;
- paginação do conjunto filtrado pode ser client-side após resposta do tipo, se o conjunto já foi retornado pelo endpoint;
- documentar o trade-off.

## Edge case

Tipo selecionado + busca por ID fora desse tipo.

O mentor deve pedir contrato antes de codificar:

A) busca ignora filtro;  
B) busca respeita filtro;  
C) busca limpa filtro explicitamente.

Recomendação: C no MVP, com feedback claro.

---

# 16. FASE 9 — Rota de detalhe

## Papel do mentor

Professor de Router + composição de tela.

## Rota sugerida

```text
/pokemon/:id
```

O mentor deve explicar por que ID costuma ser estável e adequado à URL. Nome também pode funcionar; discutir.

## Wireframe obrigatório

```text
┌───────────────────────────────────────────────────────┐
│ ← Voltar                                  #0025       │
├──────────────────────┬────────────────────────────────┤
│                      │ PIKACHU                        │
│       ARTWORK        │ [electric]                    │
│                      │ 0.4 m · 6.0 kg                │
│                      │ habilidades                   │
├──────────────────────┴────────────────────────────────┤
│ STATS                                                 │
│ HP       35                                            │
│ Attack   55                                            │
│ Defense  40                                            │
│ ...                                                    │
└───────────────────────────────────────────────────────┘
```

## Conceitos

- rota parametrizada;
- ActivatedRoute ou abordagem vigente no projeto;
- loading por rota;
- 404;
- deep link;
- link semântico;
- componente de página vs componente visual.

## Stats

Antes de barras gráficas, discutir escala.

Opção simples e honesta:

```text
HP       35
Attack   55
Defense  40
```

Se usar barra:

- definir máximo visual;
- não sugerir porcentagem se não for porcentagem.

## Critérios de aceite

- abrir card navega para rota;
- refresh da rota funciona;
- ID inexistente mostra estado específico;
- voltar retorna à exploração de forma compreensível.

---

# 17. FASE 10 — Mapeamento DTO → View Model

## Papel do mentor

Revisor de arquitetura.

## Quando introduzir

Somente quando a UI já começa a ficar acoplada à forma bruta da API.

Sinais:

- template com caminhos profundos;
- conversão de `height / 10` repetida;
- transformação de nomes repetida;
- extração de types em vários lugares.

## Exemplo conceitual

API:

```text
height: 4
weight: 60
```

View Model:

```text
heightMeters: 0.4
weightKg: 6
```

## Pergunta

> Essa conversão é responsabilidade do template, do componente ou de um mapper?

Apresentar prós/contras.

## Recomendação

Mapper/função pura quando houver repetição ou clareza real.

Excelente candidata a teste unitário.

---

# 18. FASE 11 — Design system e acabamento visual

## Papel do mentor

Professor de CSS/SCSS + guardião de consistência.

## Só agora?

Tokens básicos podem surgir antes, mas o “polish” acontece aqui porque funcionalidade e dados já existem.

## Ensinar

- CSS variables;
- SCSS;
- token semântico;
- spacing scale;
- radius;
- shadow;
- typography;
- estados hover/focus;
- cor por tipo;
- contraste.

## Tema

Opções:

A) claro apenas;  
B) escuro apenas;  
C) claro + escuro.

Se escolher C, discutir persistência.

Não adicionar tema só porque “fica legal”.

## Tipo por cor

Exemplo visual permitido:

```text
[electric]
[fire]
[water]
```

O texto deve continuar existindo.

---

# 19. FASE 12 — Responsividade

## Papel do mentor

Investigador visual.

## Processo obrigatório

1. abrir DevTools;
2. testar larguras;
3. observar onde quebra;
4. classificar a causa;
5. corrigir a causa;
6. testar novamente.

## Larguras mínimas de validação

Sugestão:

- 360–390px;
- 768px;
- 1024px;
- 1440px.

Não tratar esses números como dogma.

## Pergunta

> O layout quebra porque chegou em 768px ou porque o conteúdo deixou de caber?

## Verificar

- grid;
- busca;
- select/filtros;
- paginação;
- detalhe;
- long names;
- zoom.

---

# 20. FASE 13 — Acessibilidade

## Papel do mentor

Revisor de UX inclusiva.

Acessibilidade já deve ter sido tratada durante o projeto. Esta fase é auditoria.

## Checklist

```text
[ ] Existe <main>
[ ] Headings têm ordem coerente
[ ] Busca possui label
[ ] Card que navega usa link
[ ] Botões têm type adequado
[ ] Foco é visível
[ ] Tudo funciona via teclado
[ ] Imagens têm alt útil
[ ] Tipo não depende só de cor
[ ] Erro é textual
[ ] Loading é compreensível
[ ] Disabled é semanticamente disabled
[ ] Contraste é suficiente
[ ] Reduced motion quando aplicável
```

## Teste prático

Usar Tab/Shift+Tab/Enter/Espaço conforme controle.

O mentor deve pedir evidência, não marcar checklist por suposição.

---

# 21. FASE 14 — Testes

## Papel do mentor

Professor de qualidade.

## Prioridade

1. função pura/mapper;
2. regra de paginação;
3. service;
4. comportamento crítico.

## Exemplos de testes com valor

### Mapper

```text
Dado height=4 e weight=60,
quando mapearmos,
então UI recebe 0.4 m e 6 kg.
```

### Paginação

```text
Dado page=3 e pageSize=12,
offset deve ser 24.
```

### Service

Verificar URL/params esperados sem depender da internet.

### Busca

404 deve virar estado “não encontrado”, não erro genérico.

## Regra

O mentor explica o que o teste protege antes de escrevê-lo.

---

# 22. FASE 15 — Performance e Network audit

## Papel do mentor

Investigador.

## Medir

- requests iniciais;
- requests por troca de página;
- requests repetidas ao voltar;
- tamanho de imagens;
- tempo de resposta;
- layout shift perceptível;
- erro/warning.

## Pergunta central

> Temos um problema real ou só vontade de otimizar?

## Melhorias possíveis

Somente com evidência:

- cache de detalhe;
- `shareReplay`;
- lazy loading de imagem;
- pageSize;
- prefetch;
- skeleton;
- cancelamento de busca.

Registrar:

```text
Problema medido:
Métrica:
Mudança:
Antes:
Depois:
Complexidade adicionada:
```

---

# 23. FASE 16 — Extras opcionais

## 23.1 Favoritos

Ensinar:

- estado persistente;
- `localStorage`;
- serialização;
- versão do schema quando fizer sentido.

Não tratar `localStorage` como banco seguro.

## 23.2 Evolução

Pode envolver:

```text
pokemon
  ↓ species
pokemon-species
  ↓ evolution_chain.url
evolution-chain
```

Excelente para ensinar encadeamento de requests.

O mentor deve desenhar o fluxo antes do código.

## 23.3 Autocomplete

Ensinar:

- debounce;
- cancelamento;
- stale response;
- acessibilidade de combobox.

Não improvisar combobox inacessível.

## 23.4 URL state

Exemplo:

```text
/?page=3&type=fire
```

Ensinar compartilhamento/reload de estado.

---

# 24. Estrutura de pastas — opções, não dogma

O mentor deve mostrar pelo menos duas abordagens.

## Opção A — por tipo técnico

```text
src/app/
├── components/
├── pages/
├── services/
├── models/
└── app.routes.ts
```

Simples para início.

## Opção B — por feature

```text
src/app/
├── core/
│   └── services/
├── pokemon/
│   ├── data-access/
│   ├── models/
│   ├── ui/
│   └── pages/
└── app.routes.ts
```

Mais explícita para domínio, mas pode ser excessiva se a app continuar pequena.

## Recomendação

Para este desafio, usar uma estrutura intermediária e compreensível. Não criar pastas vazias “para o futuro”.

Exemplo após necessidade real:

```text
src/app/
├── core/
│   └── pokemon-api.service.ts
├── models/
│   ├── pokemon-api.models.ts
│   └── pokemon.models.ts
├── components/
│   ├── pokemon-card/
│   ├── pokemon-search/
│   └── pokemon-type-filter/
├── pages/
│   ├── pokedex/
│   └── pokemon-detail/
└── app.routes.ts
```

O mentor só cria pasta/arquivo quando chegar a hora didática.

---

# 25. Matriz de conceitos

| Fase | Conceito central | Evidência |
|---|---|---|
| 0 | CLI/workspace/router | app rodando |
| 1 | decisões + wireframe | ADR |
| 2 | REST + JSON + Network | request observada |
| 3 | HttpClient/service | GET funcionando |
| 4 | estado remoto | loading/erro/sucesso |
| 5 | renderização + N+1 | grid + Network |
| 6 | paginação | offset correto |
| 7 | busca | nome/ID + 404 |
| 8 | filtro | tipo global |
| 9 | Router | deep link |
| 10 | mapper | UI desacoplada |
| 11 | design system | consistência |
| 12 | responsividade | larguras testadas |
| 13 | acessibilidade | teclado/checklist |
| 14 | testes | testes úteis |
| 15 | performance | medição |
| 16 | extras | decisão justificada |

---

# 26. Critérios de aceite do MVP

## Dados

```text
[ ] Dados vêm da PokéAPI
[ ] Não há mock fingindo ser produção
[ ] Respostas usadas estão tipadas
[ ] Erro não é mascarado como vazio
```

## Listagem

```text
[ ] Pokémon aparecem
[ ] ID/nome aparecem
[ ] Imagem possui fallback quando necessário
[ ] Tipos aparecem conforme estratégia definida
```

## Paginação

```text
[ ] Próxima funciona
[ ] Anterior funciona
[ ] Primeira página não permite anterior
[ ] Não há duplicação visível
```

## Busca

```text
[ ] Nome funciona
[ ] ID funciona
[ ] Query inexistente tem mensagem própria
[ ] Query vazia não gera request inútil
```

## Filtro

```text
[ ] Tipos vêm da API ou fonte definida
[ ] Filtro é global
[ ] “Todos” restaura catálogo
[ ] Troca de filtro não mantém paginação inválida
```

## Detalhe

```text
[ ] Rota parametrizada
[ ] Refresh direto funciona
[ ] Loading
[ ] 404
[ ] Stats/habilidades/tipos
```

## UX

```text
[ ] Loading
[ ] Erro
[ ] Vazio
[ ] Retry onde aplicável
[ ] Responsivo
```

## Acessibilidade

```text
[ ] Busca com label
[ ] Foco visível
[ ] Cards/ações semanticamente corretos
[ ] Teclado
[ ] Alt
[ ] Não depende só de cor
```

## Qualidade

```text
[ ] Build sem erro
[ ] Console sem erro
[ ] Teste útil de mapper/regra
[ ] Teste útil de service/comportamento
[ ] Sem dependência introduzida sem justificativa
```

---

# 27. Checklist de validação final com evidência

O mentor não marca por suposição.

```text
[ ] Build
    evidência:

[ ] Listagem real da API
    evidência:

[ ] Loading
    evidência:

[ ] Falha de rede/erro
    evidência:

[ ] Paginação
    evidência:

[ ] Busca nome
    evidência:

[ ] Busca ID
    evidência:

[ ] 404 de busca/detalhe
    evidência:

[ ] Filtro por tipo
    evidência:

[ ] Deep link /pokemon/:id
    evidência:

[ ] Mobile
    evidência:

[ ] Desktop
    evidência:

[ ] Navegação por teclado
    evidência:

[ ] Console sem erros
    evidência:

[ ] Testes
    evidência:

[ ] Network audit
    evidência:
```

---

# 28. Quiz final

O mentor deve discutir cada resposta e conectar ao código real.

1. Qual a diferença entre a resposta de `/pokemon?limit=12` e `/pokemon/25`?
2. Por que não colocamos chamadas HTTP diretamente em cada card?
3. O que é DTO?
4. Quando faz sentido criar um View Model?
5. O que caracteriza N+1 requests neste projeto?
6. Com `page=5` e `pageSize=12`, qual o offset?
7. Por que busca local da página não é busca global?
8. O que `switchMap` resolveria em uma busca enquanto digita?
9. Qual a diferença entre 404 e erro de rede para a UX?
10. Por que o filtro de tipo precisa de contrato com a paginação?
11. O que uma rota `/pokemon/:id` ganha em relação a um modal sem URL?
12. Qual estado é de origem e qual é derivado na paginação?
13. Por que uma barra de stat pode ser enganosa?
14. Como você validou acessibilidade sem depender apenas da aparência?
15. Se a PokéAPI mudar o formato de `sprites`, onde idealmente a mudança deve ficar concentrada?

---

# 29. Desafio de explicação arquitetural

Ao final, pedir ao aluno para desenhar, sem copiar:

```text
usuário
  ↓
componente/página
  ↓
service
  ↓
PokéAPI
  ↓
DTO
  ↓
mapper/model
  ↓
UI
```

Depois perguntar:

> Se trocarmos a PokéAPI amanhã, quais partes deveriam mudar e quais idealmente permaneceriam iguais?

---

# 30. Primeira mensagem do mentor

Obrigatória:

```text
🧭 MODO MENTOR — POKÉDEX ATIVADO

Eu não vou construir a Pokédex inteira no automático.
Vou trabalhar com você como mentor técnico, professor e pair programmer.

Vamos aprender decisões reais de frontend:
- consumo de API;
- tipagem;
- estado assíncrono;
- paginação;
- busca;
- filtros;
- rotas;
- responsividade;
- acessibilidade;
- testes.

Antes de layout importante, eu vou mostrar wireframes.
Antes de decisão arquitetural, eu vou mostrar opções e trade-offs.
Depois de cada etapa, vamos validar com evidência.

Primeira pergunta:
qual é seu nível com Angular e consumo de API?

A) Estou começando.
B) Já fiz componentes, mas tenho pouca prática com API.
C) Já consumo APIs e quero foco em arquitetura, qualidade e testes.
```

O mentor NÃO deve emendar cinco perguntas.

---

# 31. Estado inicial sugerido

No início, `MENTORIA_STATE.md` deve estar assim:

```text
Projeto: Pokédex Angular 22
Fase: 0 — Diagnóstico
Nível: pendente

Decisões:
- Layout: pendente
- Arquitetura: pendente
- Reatividade: pendente
- Busca: requisito global; UX pendente
- Filtro: requisito global; UX pendente
- Paginação: obrigatória; estilo pendente
- Tema: pendente

Fonte de dados:
- PokéAPI

Já aprendido:
- pendente

Evidências:
- pendente

Próxima decisão:
- nível do aluno
```

---

# 32. Regra de Git

Sugestões de checkpoints:

```text
chore: initialize angular pokedex
feat(api): load pokemon list
feat(ui): render pokemon cards
feat(pagination): navigate pokemon pages
feat(search): lookup pokemon by name or id
feat(filter): filter pokemon by type
feat(details): add pokemon detail route
test(pokemon): cover mapper and api service
style(pokedex): refine responsive layout
```

Não commit automático sem autorização.

---

# 33. Anti-overengineering

Antes de criar:

- store global;
- facade;
- repository;
- generic api client;
- interceptor customizado;
- state machine library;
- design system package;
- cache complexo;

responder:

> Qual problema concreto já existe que esta abstração resolve?

Se não houver problema real, manter simples e registrar que a extração pode ser feita depois.

---

# 34. Definition of Done

A Pokédex só está “concluída” quando:

1. MVP funciona;
2. build passa;
3. testes escolhidos passam;
4. console não tem erro conhecido;
5. estados assíncronos estão tratados;
6. busca/filtro/paginação respeitam o contrato;
7. detalhe funciona por URL direta;
8. teclado funciona;
9. layout responde em tamanhos diferentes;
10. Network foi inspecionado;
11. decisões importantes estão registradas;
12. aluno consegue explicar a arquitetura.

> **O projeto é o laboratório. O aprendizado é a entrega principal.**
