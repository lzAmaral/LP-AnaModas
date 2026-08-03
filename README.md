# Ana Modas — Landing Page

Site institucional (landing page) da loja **Ana Modas**, em Cerquilho - SP.

## Estrutura

```
index.html       → página principal da loja
uniformes.html   → catálogo de uniformes escolares (só vitrine, sem venda online por enquanto)
css/style.css    → estilos (compartilhado pelas duas páginas)
js/script.js     → menu mobile, ano do rodapé e status "aberta agora"
assets/          → logo e fotos
assets/uniformes/ → fotos dos uniformes usadas no catálogo
```

## Pendências antes de publicar

- [ ] Confirmar telefone/WhatsApp usado nos botões (atualmente `(15) 3384-5087`).
- [ ] Revisar o texto da seção "Sobre".
- [ ] Se quiser, trocar os quadros de marca por logos reais das marcas (Malwee, Kyly, Ogochi, Momi, Siri Kids, Enfim, Lunelli, Alakazoo) — hoje estão como texto estilizado.
- [ ] **Catálogo de uniformes** (`uniformes.html`): falta só 1 item com "Foto em breve" (Blusa fechada helanca) — quando tiver a foto, salve em `assets/uniformes/` e troque o `<div class="uniforme-card__img uniforme-card__img--placeholder">` correspondente por `<img class="uniforme-card__img" src="assets/uniformes/nome-do-arquivo.jpg" alt="...">`.
- [ ] Hoje o catálogo só tem o uniforme **SESI**. Se quiser adicionar outra escola, duplique um bloco `<div class="catalogo__grid">` com um novo `<h3 class="catalogo__group-title">Nome da escola</h3>` acima.
- [ ] Preços e tamanhos vieram do catálogo em PDF (`Uniformes escolares SESI.pdf`) — se mudarem, atualize direto nos `<li>` de `.uniforme-card__prices` em `uniformes.html`.

### Cache do navegador durante edições

Os arquivos `css/style.css` e `js/script.js` são carregados com `?v=N` no HTML (ex: `style.css?v=4`) para evitar que o navegador use uma versão em cache depois de uma edição. Se mexer nesses arquivos e a mudança não aparecer, suba o número da versão no `<link>`/`<script>` correspondente (nos dois arquivos HTML).

## Rodar localmente

Basta abrir o arquivo `index.html` no navegador, ou rodar um servidor simples:

```bash
npx serve .
```

## Publicar de graça na Vercel

1. Crie uma conta em https://vercel.com (pode entrar com GitHub).
2. Suba esta pasta para um repositório no GitHub (ou use `vercel` CLI direto, sem precisar de GitHub):
   ```bash
   npm i -g vercel
   vercel
   ```
3. Siga as perguntas do terminal (aceite as opções padrão). Ao final, a Vercel te dá uma URL pública tipo `ana-modas.vercel.app`.
4. Para deploys futuros, basta rodar `vercel --prod` de novo depois de qualquer alteração.

## Aparecer no Google

- Depois de publicado, cadastre o site no [Google Search Console](https://search.google.com/search-console) com a URL da Vercel.
- Como a loja já tem uma ficha no Google (Google Meu Negócio) com boas avaliações, vale adicionar o link do novo site lá também, em "Site" — isso ajuda a página a aparecer nas buscas.
# LP-AnaModas
