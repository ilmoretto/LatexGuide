# Curso de LaTeX

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

## Busca e Navbar

- Campo “Buscar aulas…” agora integrado na topbar (cliente, sem dependências externas).
- Procura por títulos de aulas e nomes de módulos a partir de `data/modules.json`.
- Navegação por teclado: setas para cima/baixo, Enter para acessar, Esc para fechar.
- Botão "Repositório" na topbar leva para este GitHub.
- Dropdown de navegação (nav picker) na topbar: selecione módulos/aulas diretamente; a página atual aparece selecionada.
- Para expandir a busca ao conteúdo das páginas, considere:
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

## Referências Bibliográficas

Este curso foi desenvolvido com base nas seguintes fontes acadêmicas e materiais de referência:

### Principais Referências

**DOOB, Michael.** *A Gentle Introduction to TEX: A Manual for Self-study*.  
**Contribuição:** Principal fonte para os conceitos filosóficos e fundamentais do TeX/LaTeX. A seção "To err is human" foi a base para a aula sobre erros comuns. A abordagem progressiva e as explicações detalhadas sobre macros (Rolling your own) e o funcionamento interno de comandos foram essenciais para a profundidade do conteúdo.  
**Uso:** Citado para explicar a diferença entre TeX e LaTeX, o processo de compilação, a lógica de grupos ({}), o funcionamento dos espaços e a depuração de erros.

**PET-TELE (UFF).** *Apostila de LATEX*. Universidade Federal Fluminense, 2004.  
**Contribuição:** Fonte rica e estruturada para comandos práticos e listas de funcionalidades. Suas tabelas de símbolos (matemáticos, acentos, caracteres especiais) são extremamente úteis. As seções sobre a estrutura do documento (documentclass, ambientes) e formatação de texto forneceram uma base sólida e direta.  
**Uso:** Citado para a maioria dos comandos de formatação de texto (\textbf, \textit), estrutura de documento (\section, \chapter), ambientes matemáticos básicos, e especialmente para as tabelas de referência que são um ótimo material de consulta para os alunos.

**ANDRADE, Doherty.** *Uma Introdução ao LATEX*.  
**Contribuição:** Guia que ofereceu uma visão geral concisa e bem estruturada, servindo como uma excelente "cola" para conectar os conceitos. Sua abordagem clara sobre as "regras básicas" do ambiente matemático e a introdução de conceitos como o array foram muito valiosas.  
**Uso:** Usado para reforçar a estrutura mínima de um documento, a lógica dos caracteres reservados e a introdução ao ambiente matemático, incluindo as tabelas de fontes e letras gregas.

**KAVAMURA, Emílio Eiji.** *Formatação de trabalhos acadêmicos LATEX2ε - ABNT - UFPR*. 2021.  
**Contribuição:** Manual que contribuiu significativamente para a visão geral do curso. Introduz desde cedo as boas práticas e os pacotes essenciais para documentos em português (como babel, inputenc). Sua estrutura de arquivos (main.tex, 00-dados.tex, etc.) e o foco em automação (listas de figuras, sumário) guiam a forma como o conteúdo dos módulos iniciais é apresentado.  
**Uso:** Citado para justificar a escolha de pacotes como babel, inputenc, fontenc e para introduzir conceitos de elementos flutuantes (figuras e tabelas com legendas) e listas automáticas. Principal referência nos módulos avançados.

**JAMHOUR, Jorge.** *Guia rápido LATEX: para orientadores*. 2025.  
**Contribuição:** Serviu como um excelente "cheatsheet" (folha de dicas rápidas), reforçando comandos essenciais de forma direta e concisa. É particularmente útil para mostrar a sintaxe e o resultado lado a lado.  
**Uso:** Usado para validar e simplificar a apresentação de comandos essenciais, como os de formatação de texto, símbolos e a estrutura de citações.

### Fontes Complementares

**KAVAMURA, Emílio Eiji (Curso LATEX2ε ABNTEX UFPR).** *Documento Completo*.  
**Contribuição:** Similar ao manual focado em ABNT-UFPR, mas em um formato mais expandido. Serve como uma fonte abrangente que valida e enriquece os exemplos, especialmente nas seções sobre tabelas complexas, comandos de layout e personalização.  
**Uso:** Progressivamente mais utilizado nos módulos de layout, personalização e no estudo de caso da ABNT.

**(PETELE - UFF).** *Uma Introdução ao LaTeX*.  
**Contribuição e Uso:** Complementar às outras fontes, reforçando os conceitos fundamentais de forma clara e didática, especialmente no prefácio e na introdução.

---

**Nota:** Esta bibliografia oficial do curso não só dá crédito aos autores originais, mas também aponta para os alunos onde eles podem encontrar mais informações sobre cada tópico abordado nas aulas.