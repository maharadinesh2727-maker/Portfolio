// ============================================
// THEME TOGGLE (light / dark / system)
// ============================================
// On load: use the saved choice if there is one, otherwise follow the
// system's prefers-color-scheme (handled automatically by the CSS media
// query, so no attribute needs to be set for that case).
const THEME_KEY = 'portfolio-theme';
const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === 'light' || savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

const themeToggle = document.getElementById('themeToggle');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)');

function currentTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit) return explicit;
  return systemPrefersLight.matches ? 'light' : 'dark';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
});

// If the visitor never explicitly chose a theme, keep following the
// system setting live (e.g. their OS switches to dark mode at sunset).
systemPrefersLight.addEventListener('change', () => {
  if (!localStorage.getItem(THEME_KEY)) {
    document.documentElement.removeAttribute('data-theme');
  }
});

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const railNav = document.getElementById('railNav');
const railBottom = document.querySelector('.rail-bottom');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  railNav.classList.toggle('open');
  railBottom.classList.toggle('open');
});

// Close mobile nav after clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      navToggle.setAttribute('aria-expanded', 'false');
      railNav.classList.remove('open');
      railBottom.classList.remove('open');
    }
  });
});

// ============================================
// SCROLL-SPY: highlight the nav link for the section in view
// ============================================
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const setActiveLink = (id) => {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: '-40% 0px -50% 0px', // trigger when section is roughly centered
  threshold: 0
});

sections.forEach(section => observer.observe(section));