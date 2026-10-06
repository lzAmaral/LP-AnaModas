const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

// A non-modal disclosure: normal Tab navigation remains available outside it.
// Without JS the navigation stays visible, so every destination still works.
if (header && navToggle && nav) {
  const desktop = window.matchMedia('(min-width: 1080px)');
  header.classList.add('header--enhanced');
  navToggle.hidden = false;

  function setMenuOpen(open, returnFocus = false) {
    header.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (returnFocus) navToggle.focus();
  }

  navToggle.addEventListener('click', (event) => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(open);
    if (open && event.detail === 0) nav.querySelector('a')?.focus();
  });

  header.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      setMenuOpen(false);
      // A same-page destination receives focus instead of leaving it in a hidden menu.
      if (link.hash && link.pathname === window.location.pathname) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('focusin', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });
  desktop.addEventListener('change', () => {
    const focusInNav = nav.contains(document.activeElement);
    setMenuOpen(false, !desktop.matches && focusInNav);
  });
}

// Regular store hours in São Paulo time. Holiday exceptions are explained in the UI.
const STORE_HOURS = {
  Mon: [9, 18], Tue: [9, 18], Wed: [9, 18], Thu: [9, 18], Fri: [9, 18],
  Sat: [9, 14], Sun: null,
};
const WEEK_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABEL = {
  Sun: 'domingo', Mon: 'segunda-feira', Tue: 'terça-feira', Wed: 'quarta-feira',
  Thu: 'quinta-feira', Fri: 'sexta-feira', Sat: 'sábado',
};
const storeClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Sao_Paulo', weekday: 'short',
  hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
});

function storeStatus(date = new Date()) {
  const parts = Object.fromEntries(storeClock.formatToParts(date).map((part) => [part.type, part.value]));
  const day = parts.weekday;
  const minutesNow = Number(parts.hour) * 60 + Number(parts.minute);
  const todayHours = STORE_HOURS[day];

  if (todayHours && minutesNow >= todayHours[0] * 60 && minutesNow < todayHours[1] * 60) {
    return { open: true, text: `Aberta agora · até ${todayHours[1]}h` };
  }

  const todayIndex = WEEK_ORDER.indexOf(day);
  for (let i = 0; i <= 7; i += 1) {
    const key = WEEK_ORDER[(todayIndex + i) % 7];
    const hours = STORE_HOURS[key];
    if (!hours) continue;
    if (i === 0 && minutesNow < hours[0] * 60) {
      return { open: false, text: `Fechada · abre hoje às ${hours[0]}h` };
    }
    if (i > 0) {
      const label = i === 1 ? 'amanhã' : DAY_LABEL[key];
      return { open: false, text: `Fechada · abre ${label} às ${hours[0]}h` };
    }
  }
  return { open: false, text: 'Consulte os horários da loja' };
}

function renderStoreStatus() {
  const { open, text } = storeStatus();
  const badge = document.getElementById('storeStatus');
  const label = document.getElementById('storeStatusText');
  const inline = document.getElementById('storeStatusInline');

  if (badge) badge.classList.toggle('is-closed', !open);
  if (label) label.textContent = text;
  if (inline) {
    inline.textContent = text;
    inline.classList.toggle('is-closed', !open);
  }
}

if (document.getElementById('storeStatus') || document.getElementById('storeStatusInline')) {
  renderStoreStatus();
  setInterval(renderStoreStatus, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderStoreStatus();
  });
}
