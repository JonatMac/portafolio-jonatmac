/**
 * ==========================================================================
 * js/main.js
 * Lógica Global del Portafolio:
 * 1. Control del Menú Móvil (Hamburguesa)
 * 2. Detección y Marcado del Enlace de Navegación Activo
 * 3. Actualización Dinámica del Año en el Pie de Página
 * 4. Alternador de Modo Claro / Oscuro (Light/Dark Theme Switcher)
 * ==========================================================================
 */

// Aplicar tema guardado inmediatamente para evitar parpadeos visuales
(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Si no hay guardado, por defecto es dark
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Menú Móvil (Hamburguesa)
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    // Alternar menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar el menú automáticamente al hacer clic en cualquier enlace
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar el menú al hacer clic en cualquier parte fuera de la barra
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Detección y Marcado Automático del Enlace Activo
  // --------------------------------------------------------------------------
  const markActiveNavLink = () => {
    const currentPath = window.location.pathname;
    let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (!currentFile || currentFile === '') {
      currentFile = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentFile) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  markActiveNavLink();

  // --------------------------------------------------------------------------
  // 3. Año Dinámico en el Pie de Página
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 4. Alternador de Modo Claro / Oscuro (Theme Toggle)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const updateThemeUI = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon) {
      // Si el tema actual es oscuro, mostramos ☀️ para sugerir cambiar a claro
      // Si el tema actual es claro, mostramos 🌙 para sugerir cambiar a oscuro
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    if (themeToggleBtn) {
      const nextThemeLabel = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      themeToggleBtn.setAttribute('aria-label', nextThemeLabel);
      themeToggleBtn.setAttribute('title', nextThemeLabel);
    }
  };

  // Inicializar estado del icono y atributos según el tema activo
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentActiveTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentActiveTheme === 'dark' ? 'light' : 'dark';
      updateThemeUI(newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Efecto Liquid Glass: Elevación al Desplazar & Reflejo Especular Dinámico
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const syncHeaderScroll = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    syncHeaderScroll();
    window.addEventListener('scroll', syncHeaderScroll, { passive: true });
  }

  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsHover && !prefersReducedMotion) {
    const glassSurfaces = document.querySelectorAll(
      '.navbar, .footer-content, .highlight-card, .about-card, .skill-card, .skill-capsule, .project-card, .channel-card, .contact-form-card, .metric-item, .btn'
    );

    glassSurfaces.forEach((surface) => {
      let rafId = null;
      surface.addEventListener('pointermove', (event) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = surface.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          surface.style.setProperty('--gx', `${x.toFixed(1)}%`);
          surface.style.setProperty('--gy', `${y.toFixed(1)}%`);
        });
      });
    });
  }
});
