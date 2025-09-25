# Curso de LaTeX — Estrutura (HTML/CSS/JS) + Alpine.js, KaTeX e Fuse.js

Esta base fornece:
- Menu lateral responsivo (Alpine.js controla abrir/fechar).
- Páginas multi-módulo carregadas via `data/modules.json`.
- Breadcrumbs, Anterior/Próximo.
- Busca local (Fuse.js) por títulos de aulas/módulos.
- Renderização automática de fórmulas (KaTeX).

## Bibliotecas (via CDN)

- Alpine.js: interações simples (`sidebarOpen`).
- KaTeX: fórmulas (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`).
- Fuse.js: busca rápida no cliente.

Links já incluídos nas páginas:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
```

Scripts locais:
- `assets/js/main.js`: constrói sidebar, breadcrumbs e pager; emite `course:dataLoaded`.
- `assets/js/search.js`: cria índice Fuse a partir de `modules.json` e lê do campo de busca.
- `assets/js/math.js`: roda `renderMathInElement` no conteúdo `.page`.

## Como escrever fórmulas

- Inline: `$a^2 + b^2 = c^2$` ou `\(...\)`.
- Display: `$$\int_0^1 x^2\,dx = \frac{1}{3}$$` ou `\[...\]`.

## Busca

- Campo “Buscar aulas…” na topbar.
- Procura por títulos de aulas e nomes de módulos definidos em `data/modules.json`.
- Para buscar também no conteúdo, você pode:
  - Manter um índice JSON com trechos/keywords por página, ou
  - Coletar conteúdo via fetch e indexar (cuidado com CORS e performance).

## BASE_PATH (GitHub Pages)

- User/Org Pages: `<meta name="base-path" content="">`
- Project Pages: `<meta name="base-path" content="/nome-do-repo">` em todas as páginas.

## Desenvolvimento

- Sirva localmente (Live Server, `python -m http.server`, etc.) para permitir `fetch` do JSON.
- Edite `data/modules.json` para gerenciar módulos/aulas.
- Copie um dos templates `.html` ao criar novas aulas.

## Dicas

- Use Alpine para outros pequenos estados (ex.: abrir/fechar detalhes, tabs simples).
- Se a base crescer, considere migrar para Eleventy/Astro, mantendo o mesmo design.