document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  header.classList.toggle('nav-open');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => header.classList.remove('nav-open'));
});

// Horário real da loja (America/Sao_Paulo), usado para o status "aberta agora"
const STORE_HOURS = {
  Mon: [9, 18], Tue: [9, 18], Wed: [9, 18], Thu: [9, 18], Fri: [9, 18],
  Sat: [9, 14], Sun: null,
};
const WEEK_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABEL = {
  Sun: 'domingo', Mon: 'segunda', Tue: 'terça', Wed: 'quarta',
  Thu: 'quinta', Fri: 'sexta', Sat: 'sábado',
};

function saoPauloNow() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { day: parts.weekday, hour: Number(parts.hour), minute: Number(parts.minute) };
}

function storeStatus() {
  const { day, hour, minute } = saoPauloNow();
  const minutesNow = hour * 60 + minute;
  const todayHours = STORE_HOURS[day];

  if (todayHours) {
    const [openH, closeH] = todayHours;
    if (minutesNow >= openH * 60 && minutesNow < closeH * 60) {
      return { open: true, text: 'Aberta agora' };
    }
  }

  // Fechada: acha a próxima abertura
  const todayIndex = WEEK_ORDER.indexOf(day);
  for (let i = 0; i <= 7; i += 1) {
    const idx = (todayIndex + i) % 7;
    const key = WEEK_ORDER[idx];
    const hours = STORE_HOURS[key];
    if (!hours) continue;
    const [openH] = hours;
    if (i === 0 && minutesNow < openH * 60) {
      return { open: false, text: `Fechada · abre hoje às ${openH}h` };
    }
    if (i > 0) {
      const label = i === 1 ? 'amanhã' : `${DAY_LABEL[key]}-feira`;
      return { open: false, text: `Fechada · abre ${label} às ${openH}h` };
    }
  }
  return { open: false, text: 'Fechada agora' };
}

function renderStoreStatus() {
  const { open, text } = storeStatus();

  const badge = document.getElementById('storeStatus');
  const dot = document.getElementById('storeStatusDot');
  const label = document.getElementById('storeStatusText');
  const inline = document.getElementById('storeStatusInline');

  if (badge) badge.classList.toggle('is-closed', !open);
  if (dot) dot.style.color = open ? '#2fa84a' : '#b3413a';
  if (label) label.textContent = text;
  if (inline) {
    inline.textContent = `· ${text}`;
    inline.classList.toggle('is-closed', !open);
  }
}

renderStoreStatus();
setInterval(renderStoreStatus, 60000);
