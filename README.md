# Artist Portfolio

Bilingual (English / Spanish) portfolio for a short story writer and sculptor. Pure HTML + CSS + JS — no build tools, no dependencies, just open `index.html` in a browser.

---

## Adding New Content

### Add a Short Story

**1. Add the story card in `index.html`**

Copy an existing story card block and increment the number:

```html
<article class="story-card" data-story="4">
  <div class="story-card__number">04</div>
  <div class="story-card__body">
    <span class="story-card__tag" data-i18n="story4.tag">Your Tag</span>
    <h3 class="story-card__title" data-i18n="story4.title">Your Story Title</h3>
    <p class="story-card__excerpt" data-i18n="story4.excerpt"></p>
  </div>
  <button class="story-card__btn" data-story="4" data-i18n="stories.readMore">Read Story</button>
</article>
```

**2. Add translations in `script.js`**

Find the `translations` object. Add your keys to **both** the `en` and `es` blocks:

```js
// Inside en: { ... }
'story4.tag':     'Theme / Theme',
'story4.title':   'Your Story Title',
'story4.excerpt': 'A short one or two sentence teaser for the story.',
'story4.full':    `Your full story text goes here.
                   Line breaks are preserved.`,

// Inside es: { ... }
'story4.tag':     'Tema / Tema',
'story4.title':   'Título de tu cuento',
'story4.excerpt': 'Un breve párrafo de presentación del cuento.',
'story4.full':    `El texto completo del cuento va aquí.`,
```

That's it — the modal reader picks up `story4.full` automatically.

---

### Add a Sculpture

**1. Add the gallery item in `index.html`**

Find `<div class="sculpture__grid">` and add a new `<figure>` inside it:

```html
<figure class="sculpture-item">
  <div class="sculpture-item__img-wrap">
    <img
      src="images/your-photo.jpg"
      alt="Sculpture title"
      class="sculpture-item__img"
      loading="lazy"
    />
    <div class="sculpture-item__overlay">
      <div class="sculpture-item__info">
        <span class="sculpture-item__year">2025</span>
        <h3 class="sculpture-item__title" data-i18n="sculpt7.title">Piece Title</h3>
        <p  class="sculpture-item__desc"  data-i18n="sculpt7.desc">Material, dimensions</p>
      </div>
    </div>
  </div>
</figure>
```

Use `sculpture-item--tall` or `sculpture-item--wide` class on the `<figure>` to make an item span more rows or columns in the grid — good for feature pieces.

**2. Add translations in `script.js`**

```js
// Inside en: { ... }
'sculpt7.title': 'Piece Title',
'sculpt7.desc':  'Carrara marble, 40 × 20 cm',

// Inside es: { ... }
'sculpt7.title': 'Título de la pieza',
'sculpt7.desc':  'Mármol de Carrara, 40 × 20 cm',
```

**3. Add your image**

Place photo files in an `images/` folder at the project root. JPG or WebP recommended. Aim for images around 800–1200px wide for good quality without slowing the page.

---

## Changing Artist Info (Name, Bio, Contact)

All text content lives in the `translations` object in `script.js`. Search for:

| Key prefix | What it controls |
|---|---|
| `hero.*` | Hero section headline and tagline |
| `about.*` | Bio section text |
| `contact.*` | Contact section heading and labels |
| `meta.*` | Page title and SEO description |

Edit both the `en` and `es` versions for each key.

---

## File Structure

```
artist-page/
├── index.html   — Page structure and all content blocks
├── styles.css   — All visual styling
├── script.js    — Language switching, translations, interactions
└── images/      — Create this folder for your own photos
```
