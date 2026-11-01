/**
 * LA LOLA • BANQUETES & CATERING TRADICIONAL
 * JavaScript Principal Modular: Navegación, Bento Media & Armador de Banquete
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSmoothScroll();
  initArmadorBanquete();
});

/* ==========================================================================
   1. NAVEGACIÓN Y EFECTOS GENERALES
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   2. EL ARMADOR DE BANQUETE (LÓGICA INTERACTIVA)
   ========================================================================== */
const GUISADOS_CATALOG = [
  // Carnes (12)
  { id: 'c1', name: 'Puerco en chile morita', category: 'carnes', icon: '🥩' },
  { id: 'c2', name: 'Puerco salsa 3 chiles', category: 'carnes', icon: '🌶️' },
  { id: 'c3', name: 'Mole rojo con pollo', category: 'carnes', icon: '🍗' },
  { id: 'c4', name: 'Mole verde con pollo', category: 'carnes', icon: '🫑' },
  { id: 'c5', name: 'Bistec con nopales', category: 'carnes', icon: '🌵' },
  { id: 'c6', name: 'Bistec en pasilla', category: 'carnes', icon: '🥘' },
  { id: 'c7', name: 'Bistec a la mexicana', category: 'carnes', icon: '🇲🇽' },
  { id: 'c8', name: 'Pollo a la mexicana', category: 'carnes', icon: '🍅' },
  { id: 'c9', name: 'Pollo crema poblano', category: 'carnes', icon: '🫑' },
  { id: 'c10', name: 'Pollo crema chile güero', category: 'carnes', icon: '🧀' },
  { id: 'c11', name: 'Carne deshebrada', category: 'carnes', icon: '🥩' },
  { id: 'c12', name: 'Picadillo casero', category: 'carnes', icon: '🍲' },

  // Antojitos (9)
  { id: 'a1', name: 'Rajas con crema', category: 'antojitos', icon: '🌽' },
  { id: 'a2', name: 'Chorizo con papas', category: 'antojitos', icon: '🥔' },
  { id: 'a3', name: 'Chorizo a la mexicana', category: 'antojitos', icon: '🍳' },
  { id: 'a4', name: 'Chicharrón prensado', category: 'antojitos', icon: '🥓' },
  { id: 'a5', name: 'Chicharrón en salsa', category: 'antojitos', icon: '🌶️' },
  { id: 'a6', name: 'Rellena tradicional', category: 'antojitos', icon: '🥘' },
  { id: 'a7', name: 'Salchichas guisadas', category: 'antojitos', icon: '🌭' },
  { id: 'a8', name: 'Huevo con chile', category: 'antojitos', icon: '🍳' },
  { id: 'a9', name: 'Huevo con salchicha', category: 'antojitos', icon: '🥚' },

  // Verduras (7)
  { id: 'v1', name: 'Champiñones crema', category: 'verduras', icon: '🍄' },
  { id: 'v2', name: 'Champiñones ajillo', category: 'verduras', icon: '🧄' },
  { id: 'v3', name: 'Nopales guisados', category: 'verduras', icon: '🌵' },
  { id: 'v4', name: 'Nopales ensalada', category: 'verduras', icon: '🥗' },
  { id: 'v5', name: 'Papas guisadas', category: 'verduras', icon: '🥔' },
  { id: 'v6', name: 'Papas con nopales', category: 'verduras', icon: '🌵' },
  { id: 'v7', name: 'Garbanzos guisados', category: 'verduras', icon: '🥣' },

  // Bases (5)
  { id: 'b1', name: 'Arroz blanco', category: 'bases', icon: '🍚' },
  { id: 'b2', name: 'Arroz rojo', category: 'bases', icon: '🍚' },
  { id: 'b3', name: 'Frijoles refritos', category: 'bases', icon: '🫘' },
  { id: 'b4', name: 'Frijoles enchilados', category: 'bases', icon: '🌶️' },
  { id: 'b5', name: 'Frijoles de la olla', category: 'bases', icon: '🍲' }
];

const PACKAGES_CONFIG = {
  tradicional: {
    name: 'Tradicional',
    cazuelasCount: 7,
    capacity: '30 a 50 personas',
    summary: 'Arroz o frijoles, botana (chicharrón duro, tacos dorados, salsa jitomate), 1 vitrolero 20L de agua fresca, tortillas calientes.'
  },
  fiesta: {
    name: 'Fiesta Mexicana',
    cazuelasCount: 7,
    capacity: '50 a 80 personas',
    summary: 'Botana con ensalada de cueritos, 2 vitroleros (40L total) y comaleras con tortillas a mano en vivo.'
  },
  banquete: {
    name: 'Gran Banquete',
    cazuelasCount: 8,
    capacity: '80+ personas',
    summary: '8 guisados (¡1 cazuela más!), botana monumental completa, 2 vitroleros y tortillas a mano o máquina.'
  }
};

function initArmadorBanquete() {
  const slider = document.getElementById('guestSlider');
  const guestDisplay = document.getElementById('guestDisplay');
  const packageCards = document.querySelectorAll('.package-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const guisadosContainer = document.getElementById('guisadosGrid');
  const quotaText = document.getElementById('quotaText');
  const extraCards = document.querySelectorAll('.extra-card');

  // Comanda elements
  const comandaGuests = document.getElementById('comandaGuests');
  const comandaPackage = document.getElementById('comandaPackage');
  const comandaCazuelasLimit = document.getElementById('comandaCazuelasLimit');
  const comandaList = document.getElementById('comandaList');
  const comandaExtras = document.getElementById('comandaExtras');
  const btnWhatsApp = document.getElementById('btnWhatsApp');

  // Form fields
  const clientName = document.getElementById('clientName');
  const eventDate = document.getElementById('eventDate');
  const eventCity = document.getElementById('eventCity');

  if (!slider || !guisadosContainer) return;

  // State
  let currentGuests = parseInt(slider.value, 10);
  let currentPackageKey = 'fiesta';
  let selectedGuisados = new Set();
  let selectedExtras = new Set();

  // Render Initial Guisados
  renderGuisados('todas');

  // 1. Slider Event
  slider.addEventListener('input', (e) => {
    currentGuests = parseInt(e.target.value, 10);
    guestDisplay.textContent = currentGuests >= 400 ? '400+' : currentGuests;

    // Auto-select package according to guest count
    if (currentGuests <= 50) {
      setPackage('tradicional', false);
    } else if (currentGuests <= 80) {
      setPackage('fiesta', false);
    } else {
      setPackage('banquete', false);
    }

    updateComanda();
  });

  // 2. Package Cards Event
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      const pkgKey = card.getAttribute('data-package');
      setPackage(pkgKey, true);
    });
  });

  function setPackage(pkgKey, adjustSlider = false) {
    currentPackageKey = pkgKey;
    packageCards.forEach(c => {
      if (c.getAttribute('data-package') === pkgKey) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    if (adjustSlider) {
      if (pkgKey === 'tradicional') {
        slider.value = 40;
      } else if (pkgKey === 'fiesta') {
        slider.value = 65;
      } else {
        slider.value = 120;
      }
      currentGuests = parseInt(slider.value, 10);
      guestDisplay.textContent = currentGuests >= 400 ? '400+' : currentGuests;
    }

    // Check if current selected guisados exceed new limit
    const limit = getMaxCazuelas();
    if (selectedGuisados.size > limit) {
      const arr = Array.from(selectedGuisados);
      selectedGuisados = new Set(arr.slice(0, limit));
      refreshPillStates();
    }

    updateQuotaDisplay();
    updateComanda();
  }

  function getMaxCazuelas() {
    let limit = PACKAGES_CONFIG[currentPackageKey].cazuelasCount;
    if (selectedExtras.has('Cazuela Adicional')) {
      limit += 1;
    }
    return limit;
  }

  // 3. Render Guisados Pills & Categories
  function renderGuisados(category) {
    guisadosContainer.innerHTML = '';
    const filtered = category === 'todas'
      ? GUISADOS_CATALOG
      : GUISADOS_CATALOG.filter(g => g.category === category);

    filtered.forEach(item => {
      const pill = document.createElement('div');
      pill.className = 'g-pill' + (selectedGuisados.has(item.name) ? ' selected' : '');
      pill.setAttribute('data-name', item.name);
      pill.innerHTML = `
        <span class="g-pill-icon">${item.icon}</span>
        <span>${item.name}</span>
      `;

      pill.addEventListener('click', () => {
        toggleGuisado(item.name);
      });

      guisadosContainer.appendChild(pill);
    });
  }

  function toggleGuisado(name) {
    const max = getMaxCazuelas();
    if (selectedGuisados.has(name)) {
      selectedGuisados.delete(name);
    } else {
      if (selectedGuisados.size >= max) {
        alert(`Has completado el cupo de ${max} cazuelas para tu paquete. Puedes deseleccionar una o agregar el extra de "Cazuela Adicional".`);
        return;
      }
      selectedGuisados.add(name);
    }
    refreshPillStates();
    updateQuotaDisplay();
    updateComanda();
  }

  function refreshPillStates() {
    const pills = guisadosContainer.querySelectorAll('.g-pill');
    pills.forEach(pill => {
      const name = pill.getAttribute('data-name');
      if (selectedGuisados.has(name)) {
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
    });
  }

  function updateQuotaDisplay() {
    const max = getMaxCazuelas();
    const count = selectedGuisados.size;
    quotaText.textContent = `${count} de ${max} cazuelas seleccionadas`;

    if (count === max) {
      quotaText.parentElement.style.backgroundColor = 'var(--color-mint-soft)';
      quotaText.parentElement.style.color = 'var(--color-mint-accent)';
    } else {
      quotaText.parentElement.style.backgroundColor = 'var(--color-pink-soft)';
      quotaText.parentElement.style.color = 'var(--color-pink-primary)';
    }
  }

  // Category Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      renderGuisados(cat);
    });
  });

  // 4. Extras Checkboxes
  extraCards.forEach(card => {
    card.addEventListener('click', () => {
      const extraName = card.getAttribute('data-extra');
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedExtras.delete(extraName);
      } else {
        card.classList.add('selected');
        selectedExtras.add(extraName);
      }

      updateQuotaDisplay();
      updateComanda();
    });
  });

  // 5. Update Sticky Comanda Card & WhatsApp Link
  function updateComanda() {
    const pkg = PACKAGES_CONFIG[currentPackageKey];
    const max = getMaxCazuelas();

    comandaGuests.textContent = `${currentGuests >= 400 ? '400+' : currentGuests} personas`;
    comandaPackage.textContent = pkg.name;
    comandaCazuelasLimit.textContent = `(${selectedGuisados.size}/${max})`;

    // Cazuelas List
    comandaList.innerHTML = '';
    if (selectedGuisados.size === 0) {
      comandaList.innerHTML = '<li style="list-style: none; color: #A0938E; font-style: italic;">Aún no has seleccionado cazuelas</li>';
    } else {
      selectedGuisados.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        comandaList.appendChild(li);
      });
    }

    // Extras
    if (selectedExtras.size === 0) {
      comandaExtras.textContent = 'Ninguno';
    } else {
      comandaExtras.textContent = Array.from(selectedExtras).join(', ');
    }

    // Build WhatsApp Message
    updateWhatsAppUrl();
  }

  function updateWhatsAppUrl() {
    const pkg = PACKAGES_CONFIG[currentPackageKey];
    const name = clientName ? clientName.value.trim() : '';
    const date = eventDate ? eventDate.value.trim() : '';
    const city = eventCity ? eventCity.value.trim() : '';

    let cazuelasFormatted = '';
    if (selectedGuisados.size > 0) {
      let idx = 1;
      selectedGuisados.forEach(g => {
        cazuelasFormatted += `  ${idx}. ${g}%0A`;
        idx++;
      });
    } else {
      cazuelasFormatted = '  (Por definir con Claudia)%0A';
    }

    const extrasFormatted = selectedExtras.size > 0
      ? Array.from(selectedExtras).join(', ')
      : 'Ninguno';

    const msg = 
`¡Hola Claudia! Me interesa cotizar un banquete con *La Lola*:%0A%0A` +
`👥 *Invitados:* ${currentGuests >= 400 ? '400+' : currentGuests} personas%0A` +
`📦 *Paquete elegido:* ${pkg.name}%0A` +
`🥘 *Cazuelas seleccionadas:*%0A${cazuelasFormatted}` +
`✨ *Extras opcionales:* ${extrasFormatted}%0A%0A` +
`📋 *Datos de mi evento:*%0A` +
`• Nombre: ${name || '[Pendiente]'}%0A` +
`• Fecha estimada: ${date || '[Por confirmar]'}%0A` +
`• Ciudad / Lugar: ${city || 'León, Gto.'}%0A%0A` +
`¿Podrías compartirme disponibilidad y cotización formal? ¡Muchas gracias!`;

    btnWhatsApp.href = `https://wa.me/524778020791?text=${msg}`;
  }

  // Listen to input changes
  if (clientName) clientName.addEventListener('input', updateWhatsAppUrl);
  if (eventDate) eventDate.addEventListener('input', updateWhatsAppUrl);
  if (eventCity) eventCity.addEventListener('input', updateWhatsAppUrl);

  // Initial call
  updateQuotaDisplay();
  updateComanda();
}
