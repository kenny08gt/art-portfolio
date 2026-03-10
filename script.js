'use strict';

/* ============================================================
   TRANSLATIONS
============================================================ */
const translations = {
  en: {
    // Meta
    'meta.title':       'Alan Hurtarte — Writer & Sculptor',
    'meta.description': 'Portfolio of Alan Hurtarte — short story writer and sculptor.',

    // Nav
    'nav.stories':   'Stories',
    'nav.sculpture': 'Sculpture',
    'nav.about':     'About',
    'nav.contact':   'Contact',

    // Hero
    'hero.eyebrow':       'Writer · Sculptor',
    'hero.tagline':       'A builder who shapes things —\nin code, in words, and in stone.',
    'hero.cta.stories':   'Explore Stories',
    'hero.cta.sculpture': 'View Sculpture',
    'hero.scroll':        'scroll',

    // Stories section
    'stories.label':    'Short Fiction',
    'stories.title':    'Short Stories',
    'stories.subtitle': 'Intimate worlds built in brief spaces — where every word earns its place.',
    'stories.readMore': 'Read Story',

    // Story 1
    'story1.tag':     'Memory / Loss',
    'story1.title':   'The Weight of Salt',
    'story1.excerpt': 'After her mother\'s death, Lena finds a jar of salt in the kitchen — one her mother had been filling, grain by grain, for forty years. She does not know what it means. She is afraid to ask.',
    'story1.fullText': `
      <p>After her mother's death, Lena found the jar on the second shelf of the kitchen cupboard, behind the paprika and the bay leaves. It was a mason jar, wide-mouthed and sealed with wax, half-full of coarse grey salt.</p>
      <p>Her aunt, who had come from Córdoba to help sort through the house, told her it was nothing. A habit, perhaps. Some people kept things.</p>
      <p>But Lena knew her mother. Her mother did not keep things. She had moved seventeen times in forty years, each move a kind of erasure, shedding rooms and furniture and photographs the way a tree sheds bark — not painfully, but as a matter of course. She owned six dresses. She did not keep things.</p>
      <p>The jar stayed on the kitchen table while Lena packed boxes. She found herself circling it. The salt was not ordinary salt — it was rough, mineral, the color of a winter sky, and it had been collected one grain at a time, perhaps, because there were no clumps, no settling, only this even grey mass.</p>
      <p>On the third day, she opened it.</p>
      <p>The smell hit her first — brine and stone and something else, something she could not name, that made her eyes fill not with grief exactly but with the sensation of being very small in a very large room. She touched a single grain to her tongue. It tasted like the sea before a storm, or the way she imagined the sea before a storm, having never been near the sea when it was angry.</p>
      <p>She sealed it again. She put it in her coat pocket. She carried it back to Madrid on the train, and when her husband asked what was in her bag she said, <em>nothing, just something of my mother's</em>, which was true, which told him nothing.</p>
      <p>It lives now on her windowsill, in the morning light, and she does not know what it means. She has not tried again to find out. There are things we carry whose meaning arrives, if it arrives at all, only later, only when we are ready, only when we have grown large enough to hold them.</p>
      <p>She is not there yet. She is being patient.</p>
    `,

    // Story 2
    'story2.tag':     'Solitude / Time',
    'story2.title':   'A Cartography of Afternoons',
    'story2.excerpt': 'The old clockmaker repairs timepieces nobody comes to collect. He lines them on the shelf anyway — tick by tick, a chorus that keeps him from disappearing entirely.',
    'story2.fullText': `
      <p>Aurelio has been repairing clocks for fifty-one years, and for the last eleven of those years, nobody has come to collect them.</p>
      <p>This is not entirely accurate. Occasionally someone comes. A woman drove in from the coast last spring to retrieve a mantel clock that had belonged to her grandmother. A retired teacher brought in a pocket watch in October, collected it in November. But these are exceptions. The general condition of the shop is one of arrival without departure: clocks come in, clocks are repaired, clocks remain.</p>
      <p>He has stopped invoicing. There is no one to invoice.</p>
      <p>What Aurelio does instead is arrange them. He gives them positions of honor or obscurity based on criteria he has not fully articulated even to himself — something to do with the quality of their sound, the elegance of their mechanism, what they seem to want. The grandfather clock near the door wants to be seen. The little carriage clock on the third shelf, the one with the enamel face and the crack in its glass, wants to be left alone. He respects these preferences.</p>
      <p>The sound in the shop at noon is extraordinary. He has tried to describe it to his daughter, who lives in another city and calls on Sundays. It is like, he told her once, standing inside a body that is thinking. She did not know what he meant. He was not sure he did either, but it felt true.</p>
      <p>In the afternoons, when the light comes through the west window and strikes all the clock faces at once, he makes tea and sits in his chair and listens. He is mapping something, he thinks. A country with no borders, a territory of minutes accumulating into hours accumulating into years. He is not lonely. He is very busy. He is the keeper of all this time that no one has come to collect, and someone has to do it, and it might as well be him.</p>
      <p>He winds them every morning. He will do so, he supposes, until he can't.</p>
    `,

    // Story 3
    'story3.tag':     'Identity / Migration',
    'story3.title':   'The Language My Hands Remember',
    'story3.excerpt': 'Marco crosses the border speaking no English, carrying only a photograph and the way his grandmother taught him to fold dough — a gesture that survives every translation.',
    'story3.fullText': `
      <p>There are things Marco did not know how to say in English and so could not lose.</p>
      <p>He did not know the English for <em>el doblez</em> — the fold, the specific fold, the one his grandmother had demonstrated on a floured table in a kitchen in Sonora when he was six years old and had been demonstrating every time he watched her cook since then, which meant he had been learning it for twenty-two years without knowing he was learning anything. He did not know the English for the sound the dough makes when it is ready. He did not know the English for the weight of it.</p>
      <p>In Phoenix, he worked first at a construction site and then, through a cousin's cousin, in a restaurant kitchen. The chef there was from Oaxaca and spoke Spanish and told him he was hired. Marco had been in the country eleven days.</p>
      <p>What surprised him was not the hardness of the work, which he had expected, but the way the kitchen recognized him. Not the people — the kitchen itself. The weight of a rolling pin. The resistance of dough. The heat of an oven calibrated by instinct rather than number. His hands knew where they were. His hands had always known.</p>
      <p>He called his grandmother on a Sunday. He told her he was making her bread. She said, <em>who taught you</em>, and he laughed, and she laughed, and for a moment the distance collapsed entirely and they were in the kitchen in Sonora with flour on their hands and the smell of yeast in the air and nothing else mattered at all.</p>
      <p>Later, walking home through a street where he could not read the signs, he thought about what survives. Language goes first, or goes sideways, becomes a river with two banks between which you live. Memory becomes selective, brightening some things and dimming others. But the body — the body is stubborn. The body holds its knowledge like a fist: tightly, quietly, refusing to let go.</p>
      <p>His grandmother died the following spring. He baked bread the morning after he heard, and he baked it correctly, and he wept, and it was the best bread he had ever made.</p>
    `,

    // Sculpture
    'sculpture.label':    'Three-Dimensional Work',
    'sculpture.title':    'Sculpture',
    'sculpture.subtitle': 'Material given intention — stone, bronze, and clay shaped by presence and by absence.',

    'sculpt1.title': 'Erosion Study No. 3',
    'sculpt1.desc':  'Carrara marble, 42 × 18 × 14 cm',
    'sculpt2.title': 'Threshold',
    'sculpt2.desc':  'Cast bronze, 28 × 12 × 9 cm',
    'sculpt3.title': 'The Hollow Season',
    'sculpt3.desc':  'Fired clay and resin, 35 × 22 × 16 cm',
    'sculpt4.title': 'Confluence',
    'sculpt4.desc':  'Welded steel and patinated copper, 80 × 45 × 30 cm',
    'sculpt5.title': 'Ligature',
    'sculpt5.desc':  'Limestone and iron wire, 55 × 20 × 18 cm',
    'sculpt6.title': 'Nocturne I',
    'sculpt6.desc':  'Black granite, hand-finished, 30 × 15 × 12 cm',

    // About
    'about.label': 'The Artist',
    'about.title': 'About Alan',
    'about.bio1':  'Alan Hurtarte is a Guatemalan software engineer, builder, and creative thinker who blends technology with artistic exploration. With a strong background in full-stack development, he has worked extensively with Laravel, React, and modern AI systems, focusing on creating practical software products and scalable digital businesses.',
    'about.bio2':  'His work often centers on turning complex ideas into simple, useful tools. Beyond technology, Alan is drawn to creative expression — writing fiction and reflective pieces that explore human experience, structure, and meaning, often with a thoughtful and analytical voice.',
    'about.bio3':  'He also experiments with sculpture and hands-on artistic projects, working with materials like metal and mixed media to create physical forms that contrast with his digital work.',
    'about.bio4':  'Whether building software, shaping stories, or crafting objects, Alan approaches every project with curiosity, precision, and a desire to understand how things work — then make them better.',

    // Contact
    'contact.label':   'Get in Touch',
    'contact.title':   'Contact',
    'contact.subtitle':'For commissions, collaborations, or just to say hello — reach out below.',
    'contact.name':    'Name',
    'contact.email':   'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send':    'Send Message',
    'contact.success': 'Thank you — your message has been received.',

    // Footer
    'footer.copy':  '© 2026 Alan Hurtarte. All rights reserved.',
    'footer.craft': 'Words & Stone',
  },

  es: {
    // Meta
    'meta.title':       'Alan Hurtarte — Escritor y Escultor',
    'meta.description': 'Portafolio de Alan Hurtarte — escritor de cuentos y escultor.',

    // Nav
    'nav.stories':   'Cuentos',
    'nav.sculpture': 'Escultura',
    'nav.about':     'Sobre mí',
    'nav.contact':   'Contacto',

    // Hero
    'hero.eyebrow':       'Escritor · Escultor',
    'hero.tagline':       'Un constructor que da forma a las cosas —\nen código, en palabras y en piedra.',
    'hero.cta.stories':   'Explorar Cuentos',
    'hero.cta.sculpture': 'Ver Escultura',
    'hero.scroll':        'desplazar',

    // Stories section
    'stories.label':    'Ficción Corta',
    'stories.title':    'Cuentos',
    'stories.subtitle': 'Mundos íntimos construidos en espacios breves — donde cada palabra gana su lugar.',
    'stories.readMore': 'Leer Cuento',

    // Story 1
    'story1.tag':     'Memoria / Pérdida',
    'story1.title':   'El Peso de la Sal',
    'story1.excerpt': 'Tras la muerte de su madre, Lena encuentra un frasco de sal en la cocina — uno que su madre había llenado, grano a grano, durante cuarenta años. No sabe qué significa. Tiene miedo de preguntar.',
    'story1.fullText': `
      <p>Después de la muerte de su madre, Lena encontró el frasco en el segundo estante del armario de la cocina, detrás del pimentón y las hojas de laurel. Era un tarro de cristal de boca ancha, sellado con cera, medio lleno de sal gruesa y gris.</p>
      <p>Su tía, que había venido desde Córdoba para ayudar a ordenar la casa, le dijo que no era nada. Un hábito, quizás. Hay personas que guardan cosas.</p>
      <p>Pero Lena conocía a su madre. Su madre no guardaba cosas. Se había mudado diecisiete veces en cuarenta años, cada mudanza una especie de borrado, desprendiéndose de habitaciones y muebles y fotografías como un árbol se desprende de su corteza — no con dolor, sino como cuestión natural. Tenía seis vestidos. No guardaba cosas.</p>
      <p>El frasco se quedó sobre la mesa de la cocina mientras Lena empacaba cajas. Ella se descubrió girando a su alrededor. La sal no era sal ordinaria — era áspera, mineral, del color de un cielo de invierno, y había sido recolectada de a un grano por vez, quizás, porque no había grumos ni sedimentos, solo esa masa gris y uniforme.</p>
      <p>Al tercer día, lo abrió.</p>
      <p>Primero la golpeó el olor — salmuera, piedra y algo más, algo que no podía nombrar, que le llenó los ojos no exactamente de tristeza sino de la sensación de ser muy pequeña en una habitación muy grande. Tocó un solo grano con la lengua. Sabía como el mar antes de una tormenta, o como ella imaginaba el mar antes de una tormenta, nunca habiéndose acercado al mar cuando estaba furioso.</p>
      <p>Lo selló de nuevo. Lo puso en el bolsillo del abrigo. Lo llevó de vuelta a Madrid en el tren, y cuando su marido preguntó qué había en su bolso, ella dijo, <em>nada, solo algo de mi madre</em>, lo que era verdad, lo que no le decía nada.</p>
      <p>Ahora vive en su alféizar, a la luz de la mañana, y ella no sabe qué significa. No ha intentado averiguarlo. Hay cosas que uno carga cuyo significado llega, si es que llega, sólo después, sólo cuando uno está listo, sólo cuando uno ha crecido lo suficiente para sostenerlas.</p>
      <p>Todavía no ha llegado allí. Está siendo paciente.</p>
    `,

    // Story 2
    'story2.tag':     'Soledad / Tiempo',
    'story2.title':   'Una Cartografía de las Tardes',
    'story2.excerpt': 'El viejo relojero repara relojes que nadie viene a buscar. Los alinea en el estante de todas formas — tictac a tictac, un coro que lo mantiene de no desaparecer del todo.',
    'story2.fullText': `
      <p>Aurelio lleva cincuenta y un años reparando relojes, y durante los últimos once de esos años, nadie ha venido a recogerlos.</p>
      <p>Esto no es del todo exacto. De vez en cuando alguien viene. Una mujer condujo desde la costa la primavera pasada para recoger un reloj de repisa que había pertenecido a su abuela. Un maestro jubilado trajo un reloj de bolsillo en octubre, lo recogió en noviembre. Pero estos son excepciones. La condición general de la tienda es de llegada sin partida: los relojes llegan, los relojes son reparados, los relojes permanecen.</p>
      <p>Ha dejado de hacer facturas. No hay nadie a quien facturar.</p>
      <p>Lo que Aurelio hace en cambio es ordenarlos. Les da posiciones de honor u oscuridad según criterios que no ha articulado del todo, ni siquiera para sí mismo — algo relacionado con la calidad de su sonido, la elegancia de su mecanismo, lo que parecen querer. El reloj de caja junto a la puerta quiere ser visto. El pequeño reloj de viaje en el tercer estante, el de la esfera de esmalte y la grieta en su cristal, quiere que lo dejen solo. Él respeta esas preferencias.</p>
      <p>El sonido en la tienda al mediodía es extraordinario. Ha intentado describirlo a su hija, que vive en otra ciudad y llama los domingos. Es como, le dijo una vez, estar dentro de un cuerpo que está pensando. Ella no supo qué quería decir. Él tampoco estaba seguro, pero se sentía verdadero.</p>
      <p>Por las tardes, cuando la luz entra por la ventana del oeste y golpea todas las esferas de los relojes a la vez, prepara té y se sienta en su sillón y escucha. Está trazando algo, piensa. Un país sin fronteras, un territorio de minutos que se acumulan en horas que se acumulan en años. No está solo. Está muy ocupado. Es el guardián de todo este tiempo que nadie ha venido a recoger, y alguien tiene que hacerlo, y bien podría ser él.</p>
      <p>Los da cuerda cada mañana. Lo hará, supone, hasta que no pueda.</p>
    `,

    // Story 3
    'story3.tag':     'Identidad / Migración',
    'story3.title':   'El Idioma que Recuerdan Mis Manos',
    'story3.excerpt': 'Marco cruza la frontera sin hablar inglés, cargando solo una fotografía y la manera en que su abuela le enseñó a doblar la masa — un gesto que sobrevive toda traducción.',
    'story3.fullText': `
      <p>Había cosas que Marco no sabía decir en inglés y por lo tanto no podía perder.</p>
      <p>No sabía el inglés para <em>el doblez</em> — el pliegue, el pliegue específico, el que su abuela había demostrado sobre una mesa enharinada en una cocina de Sonora cuando él tenía seis años y había estado demostrando cada vez que él la veía cocinar desde entonces, lo que significaba que llevaba veintidós años aprendiéndolo sin saber que estaba aprendiendo nada. No sabía el inglés para el sonido que hace la masa cuando está lista. No sabía el inglés para su peso.</p>
      <p>En Phoenix, trabajó primero en una construcción y luego, a través de un primo de un primo, en la cocina de un restaurante. El chef era de Oaxaca y hablaba español y le dijo que estaba contratado. Marco llevaba once días en el país.</p>
      <p>Lo que lo sorprendió no fue la dureza del trabajo, que había esperado, sino la manera en que la cocina lo reconocía. No las personas — la cocina en sí misma. El peso de un rodillo. La resistencia de la masa. El calor de un horno calibrado por instinto más que por número. Sus manos sabían dónde estaban. Sus manos siempre lo habían sabido.</p>
      <p>Llamó a su abuela un domingo. Le dijo que estaba haciendo su pan. Ella preguntó, <em>quién te enseñó</em>, y él se rió, y ella se rió, y por un momento la distancia colapsó por completo y estaban en la cocina de Sonora con harina en las manos y el olor de la levadura en el aire y nada más importaba en absoluto.</p>
      <p>Más tarde, caminando a casa por una calle donde no podía leer los letreros, pensó en lo que sobrevive. El idioma se va primero, o se va de costado, se convierte en un río con dos orillas entre las cuales uno vive. La memoria se vuelve selectiva, iluminando algunas cosas y oscureciendo otras. Pero el cuerpo — el cuerpo es terco. El cuerpo sostiene su conocimiento como un puño: fuertemente, silenciosamente, negándose a soltar.</p>
      <p>Su abuela murió la primavera siguiente. Él horneó pan la mañana después de enterarse, y lo horneó correctamente, y lloró, y fue el mejor pan que había hecho en su vida.</p>
    `,

    // Sculpture
    'sculpture.label':    'Obra Tridimensional',
    'sculpture.title':    'Escultura',
    'sculpture.subtitle': 'Material con intención — piedra, bronce y arcilla moldeados por la presencia y la ausencia.',

    'sculpt1.title': 'Estudio de Erosión Nº 3',
    'sculpt1.desc':  'Mármol de Carrara, 42 × 18 × 14 cm',
    'sculpt2.title': 'Umbral',
    'sculpt2.desc':  'Bronce fundido, 28 × 12 × 9 cm',
    'sculpt3.title': 'La Estación Hueca',
    'sculpt3.desc':  'Barro cocido y resina, 35 × 22 × 16 cm',
    'sculpt4.title': 'Confluencia',
    'sculpt4.desc':  'Acero soldado y cobre patinadado, 80 × 45 × 30 cm',
    'sculpt5.title': 'Ligadura',
    'sculpt5.desc':  'Piedra caliza e hilo de hierro, 55 × 20 × 18 cm',
    'sculpt6.title': 'Nocturno I',
    'sculpt6.desc':  'Granito negro, acabado a mano, 30 × 15 × 12 cm',

    // About
    'about.label': 'El Artista',
    'about.title': 'Sobre Alan',
    'about.bio1':  'Alan Hurtarte es un ingeniero de software guatemalteco, constructor y pensador creativo que combina la tecnología con la exploración artística. Con una sólida formación en desarrollo full-stack, ha trabajado extensamente con herramientas como Laravel, React y sistemas modernos de IA, enfocándose en crear productos de software prácticos y negocios digitales escalables.',
    'about.bio2':  'Su trabajo a menudo se centra en convertir ideas complejas en herramientas simples y útiles. Más allá de la tecnología, Alan se inclina hacia la expresión creativa — escribe ficción y piezas reflexivas que exploran la experiencia humana, la estructura y el significado, con una voz reflexiva y analítica.',
    'about.bio3':  'También experimenta con la escultura y proyectos artísticos prácticos, trabajando con materiales como metal y medios mixtos para crear formas físicas que contrastan con su trabajo digital.',
    'about.bio4':  'Ya sea construyendo software, dando forma a historias o creando objetos, Alan aborda cada proyecto con curiosidad, precisión y el deseo de entender cómo funcionan las cosas — para luego mejorarlas.',

    // Contact
    'contact.label':   'Ponerse en Contacto',
    'contact.title':   'Contacto',
    'contact.subtitle':'Para comisiones, colaboraciones o simplemente saludar — escríbeme abajo.',
    'contact.name':    'Nombre',
    'contact.email':   'Correo Electrónico',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.send':    'Enviar Mensaje',
    'contact.success': 'Gracias — tu mensaje ha sido recibido.',

    // Footer
    'footer.copy':  '© 2026 Alan Hurtarte. Todos los derechos reservados.',
    'footer.craft': 'Palabras y Piedra',
  }
};

/* ============================================================
   STATE
============================================================ */
let currentLang = 'en';

/* ============================================================
   LANGUAGE TOGGLE
============================================================ */
function applyTranslations(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update document title
  document.title = t['meta.title'];

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!t[key]) return;

    // Use innerHTML for elements that may contain markup (bio, awards)
    if (el.tagName === 'P' || el.classList.contains('award__name')) {
      el.innerHTML = t[key];
    } else if (el.tagName === 'BUTTON' || el.tagName === 'A') {
      // For newline support in tagline rendered as separate lines
      el.textContent = t[key];
    } else {
      el.innerHTML = t[key];
    }

    // Special case: hero tagline with \n -> <br>
    if (key === 'hero.tagline') {
      el.innerHTML = t[key].replace(/\n/g, '<br>');
    }
  });

  // Update lang toggle UI
  const active = document.getElementById('langLabel');
  const other  = document.getElementById('langOther');
  if (lang === 'en') {
    active.textContent = 'EN';
    other.textContent  = 'ES';
  } else {
    active.textContent = 'ES';
    other.textContent  = 'EN';
  }

  // Update <html lang>
  document.documentElement.lang = lang;
}

function toggleLanguage() {
  const next = currentLang === 'en' ? 'es' : 'en';
  applyTranslations(next);
  // Re-populate modal if open
  const modal = document.getElementById('storyModal');
  if (modal.classList.contains('open')) {
    const storyId = modal.dataset.openStory;
    if (storyId) openModal(storyId);
  }
}

document.getElementById('langToggle').addEventListener('click', toggleLanguage);

/* ============================================================
   NAVIGATION — SCROLL BEHAVIOR
============================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   NAVIGATION — MOBILE HAMBURGER
============================================================ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ============================================================
   STORY MODAL
============================================================ */
const storyModal   = document.getElementById('storyModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose   = document.getElementById('modalClose');
const modalTag     = document.getElementById('modalTag');
const modalTitle   = document.getElementById('modalTitle');
const modalBody    = document.getElementById('modalBody');

function openModal(storyId) {
  const t = translations[currentLang];
  const id = storyId;

  modalTag.textContent   = t[`story${id}.tag`]   || '';
  modalTitle.textContent = t[`story${id}.title`] || '';
  modalBody.innerHTML    = t[`story${id}.fullText`] || '';

  storyModal.dataset.openStory = id;
  storyModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Scroll modal to top
  const scrollEl = storyModal.querySelector('.modal__scroll');
  if (scrollEl) scrollEl.scrollTop = 0;

  // Focus the close button for accessibility
  setTimeout(() => modalClose.focus(), 50);
}

function closeModal() {
  storyModal.classList.remove('open');
  document.body.style.overflow = '';
  delete storyModal.dataset.openStory;
}

// Open modal on card button click
document.querySelectorAll('.story-card__btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.story));
});

// Close handlers
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && storyModal.classList.contains('open')) closeModal();
});

/* ============================================================
   SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  // Add reveal class to target elements
  const targets = [
    '.section__header',
    '.story-card',
    '.sculpture-item',
    '.about__portrait',
    '.about__text',
    '.contact__inner',
  ];

  targets.forEach((selector, selectorIndex) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger items in the same group
      const delay = (i % 4) + 1;
      if (delay > 1) el.classList.add(`reveal-delay-${delay - 1}`);
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   CONTACT FORM
============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const inputs = contactForm.querySelectorAll('input, textarea');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = 'rgba(200,80,80,0.6)';
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) return;

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.style.opacity = '0.6';

  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      formSuccess.classList.add('visible');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    } else {
      alert('Something went wrong. Please email alan.hurtarte@gmail.com directly.');
    }
  })
  .catch(() => {
    alert('Something went wrong. Please email alan.hurtarte@gmail.com directly.');
  })
  .finally(() => {
    btn.disabled = false;
    btn.style.opacity = '';
  });
});

// Remove error styling on input
contactForm.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
  });
});

/* ============================================================
   SMOOTH SCROLL — handle nav links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations('en');
  initScrollReveal();
});
