/**
 * LA LOLA • BANQUETES & CATERING TRADICIONAL
 * JavaScript Principal Modular: Navegación, Bento Media & Armador de Banquete
 */

// Catálogo Completo de los 32 Guisados
const GUISADOS_LIST = [
  // Carnes (12)
  { id: 'c1', name: 'Puerco en chile morita', cat: 'carnes', icon: '🥩' },
  { id: 'c2', name: 'Puerco salsa 3 chiles', cat: 'carnes', icon: '🌶️' },
  { id: 'c3', name: 'Mole rojo con pollo', cat: 'carnes', icon: '🍗' },
  { id: 'c4', name: 'Mole verde con pollo', cat: 'carnes', icon: '🫑' },
  { id: 'c5', name: 'Bistec con nopales', cat: 'carnes', icon: '🌵' },
  { id: 'c6', name: 'Bistec en pasilla', cat: 'carnes', icon: '🥘' },
  { id: 'c7', name: 'Bistec a la mexicana', cat: 'carnes', icon: '🇲🇽' },
  { id: 'c8', name: 'Pollo a la mexicana', cat: 'carnes', icon: '🍅' },
  { id: 'c9', name: 'Pollo crema poblano', cat: 'carnes', icon: '🫑' },
  { id: 'c10', name: 'Pollo crema chile güero', cat: 'carnes', icon: '🧀' },
  { id: 'c11', name: 'Carne deshebrada', cat: 'carnes', icon: '🥩' },
  { id: 'c12', name: 'Picadillo casero', cat: 'carnes', icon: '🍲' },

  // Antojitos (9)
  { id: 'a1', name: 'Rajas con crema', cat: 'antojitos', icon: '🌽' },
  { id: 'a2', name: 'Chorizo con papas', cat: 'antojitos', icon: '🥔' },
  { id: 'a3', name: 'Chorizo a la mexicana', cat: 'antojitos', icon: '🍳' },
  { id: 'a4', name: 'Chicharrón prensado', cat: 'antojitos', icon: '🥓' },
  { id: 'a5', name: 'Chicharrón en salsa', cat: 'antojitos', icon: '🌶️' },
  { id: 'a6', name: 'Rellena tradicional', cat: 'antojitos', icon: '🥘' },
  { id: 'a7', name: 'Salchichas guisadas', cat: 'antojitos', icon: '🌭' },
  { id: 'a8', name: 'Huevo con chile', cat: 'antojitos', icon: '🍳' },
  { id: 'a9', name: 'Huevo con salchicha', cat: 'antojitos', icon: '🥚' },

  // Verduras (7)
  { id: 'v1', name: 'Champiñones crema', cat: 'verduras', icon: '🍄' },
  { id: 'v2', name: 'Champiñones ajillo', cat: 'verduras', icon: '🧄' },
  { id: 'v3', name: 'Nopales guisados', cat: 'verduras', icon: '🌵' },
  { id: 'v4', name: 'Nopales ensalada', cat: 'verduras', icon: '🥗' },
  { id: 'v5', name: 'Papas guisadas', cat: 'verduras', icon: '🥔' },
  { id: 'v6', name: 'Papas con nopales', cat: 'verduras', icon: '🌵' },
  { id: 'v7', name: 'Garbanzos guisados', cat: 'verduras', icon: '🥣' },

  // Bases (5)
  { id: 'b1', name: 'Arroz blanco', cat: 'bases', icon: '🍚' },
  { id: 'b2', name: 'Arroz rojo', cat: 'bases', icon: '🍚' },
  { id: 'b3', name: 'Frijoles refritos', cat: 'bases', icon: '🫘' },
  { id: 'b4', name: 'Frijoles enchilados', cat: 'bases', icon: '🌶️' },
  { id: 'b5', name: 'Frijoles de la olla', cat: 'bases', icon: '🍲' }
];

// Configuración de paquetes
const PACKAGES = {
  '30-50': {
    name: 'Paquete Tradicional',
    cazuelas: 7,
    benefits: 'Incluye: 7 guisados en cazuela, arroz o frijoles, botana (chicharrón duro, tacos dorados, salsa de jitomate), 1 vitrolero 20L de agua fresca, tortillas calientes.'
  },
  '50-80': {
    name: 'Paquete Fiesta Mexicana',
    cazuelas: 7,
    benefits: 'Incluye: 7 guisados, botana con ensalada de cueritos, 2 vitroleros de agua (40L total) y comaleras con tortillas a mano en vivo.'
  },
  '80+': {
    name: 'Gran Banquete',
    cazuelas: 8,
    benefits: 'Incluye: 8 guisados (¡1 cazuela más!), botana monumental completa, 2 vitroleros y tortillas a mano o máquina.'
  }
};

// Estado global de la comanda
let currentPackage = '50-80';
let currentGuests = 65;
let selectedDishes = new Set();
let selectedExtras = new Set();
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSmoothScroll();
  renderPills();
  updateSummary();
});

/* --------------------------------------------------------------------------
   1. NAVEGACIÓN Y EFECTOS
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   2. PAQUETES & SLIDER
   -------------------------------------------------------------------------- */
window.choosePackage = function(pkgCode) {
  currentPackage = pkgCode;
  
  // Actualizar tarjetas activas
  document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('active'));
  const activeCard = document.getElementById(`pkg-${pkgCode}`);
  if (activeCard) activeCard.classList.add('active');

  // Ajustar slider según paquete seleccionado
  const slider = document.getElementById('guestSlider');
  if (slider) {
    if (pkgCode === '30-50' && (currentGuests < 30 || currentGuests > 50)) {
      slider.value = 40;
      onGuestSlider(40);
    } else if (pkgCode === '50-80' && (currentGuests <= 50 || currentGuests > 80)) {
      slider.value = 65;
      onGuestSlider(65);
    } else if (pkgCode === '80+' && currentGuests <= 80) {
      slider.value = 120;
      onGuestSlider(120);
    }
  }

  // Verificar si las cazuelas exceden el límite
  validateDishLimit();
  updateSummary();
};

window.onGuestSlider = function(val) {
  currentGuests = parseInt(val, 10);
  const display = document.getElementById('guestDisplay');
  if (display) {
    display.textContent = `${currentGuests >= 350 ? '350+' : currentGuests} Personas`;
  }

  // Auto-seleccionar paquete según cantidad de invitados
  let newPkg = currentPackage;
  if (currentGuests <= 50) {
    newPkg = '30-50';
  } else if (currentGuests <= 80) {
    newPkg = '50-80';
  } else {
    newPkg = '80+';
  }

  if (newPkg !== currentPackage) {
    currentPackage = newPkg;
    document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('active'));
    const targetCard = document.getElementById(`pkg-${newPkg}`);
    if (targetCard) targetCard.classList.add('active');
    validateDishLimit();
  }

  updateSummary();
};

function getDishLimit() {
  let limit = PACKAGES[currentPackage].cazuelas;
  if (selectedExtras.has('Cazuela extra adicional de guisado')) {
    limit += 1;
  }
  return limit;
}

function validateDishLimit() {
  const limit = getDishLimit();
  if (selectedDishes.size > limit) {
    const arr = Array.from(selectedDishes);
    selectedDishes = new Set(arr.slice(0, limit));
    renderPills();
  }
}

/* --------------------------------------------------------------------------
   3. FILTRADO Y SELECCIÓN DE GUISADOS (.g-pill)
   -------------------------------------------------------------------------- */
window.filterDishes = function(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPills();
};

function renderPills() {
  const container = document.getElementById('pillsGrid');
  if (!container) return;

  container.innerHTML = '';
  const filtered = currentFilter === 'all'
    ? GUISADOS_LIST
    : GUISADOS_LIST.filter(g => g.cat === currentFilter);

  filtered.forEach(dish => {
    const pill = document.createElement('div');
    const isSelected = selectedDishes.has(dish.name);
    pill.className = `g-pill ${isSelected ? 'selected' : ''}`;
    pill.innerHTML = `<span>${dish.icon}</span> <span>${dish.name}</span>`;

    pill.addEventListener('click', () => {
      toggleDish(dish.name);
    });

    container.appendChild(pill);
  });

  updateCounts();
}

function toggleDish(name) {
  const limit = getDishLimit();
  if (selectedDishes.has(name)) {
    selectedDishes.delete(name);
  } else {
    if (selectedDishes.size >= limit) {
      alert(`Has alcanzado el límite de ${limit} cazuelas para este paquete. Deselecciona una o agrega el extra de "Cazuela Adicional".`);
      return;
    }
    selectedDishes.add(name);
  }
  renderPills();
  updateSummary();
}

function updateCounts() {
  const limit = getDishLimit();
  const cCount = document.getElementById('cCount');
  const cLimit = document.getElementById('cLimit');
  if (cCount) cCount.textContent = selectedDishes.size;
  if (cLimit) cLimit.textContent = limit;
}

/* --------------------------------------------------------------------------
   4. EXTRAS & ESPECIALIDADES
   -------------------------------------------------------------------------- */
window.toggleExtra = function(elem, extraName) {
  if (selectedExtras.has(extraName)) {
    selectedExtras.delete(extraName);
    elem.classList.remove('selected');
  } else {
    selectedExtras.add(extraName);
    elem.classList.add('selected');
  }

  validateDishLimit();
  updateCounts();
  updateSummary();
};

window.addSpecialty = function(specialtyName) {
  // Desplazarse al cotizador
  const armarSection = document.getElementById('armar');
  if (armarSection) {
    armarSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Buscar si coincide con algún extra
  document.querySelectorAll('.extra-item').forEach(item => {
    if (item.textContent.toLowerCase().includes(specialtyName.toLowerCase().slice(0, 8))) {
      if (!item.classList.contains('selected')) {
        item.click();
      }
    }
  });
};

/* --------------------------------------------------------------------------
   5. RESUMEN COMANDA STICKY & WHATSAPP
   -------------------------------------------------------------------------- */
function updateSummary() {
  const pkg = PACKAGES[currentPackage];
  const limit = getDishLimit();

  const sumPkg = document.getElementById('sumPkg');
  const sumGuests = document.getElementById('sumGuests');
  const sumGuisos = document.getElementById('sumGuisos');
  const sumList = document.getElementById('sumList');
  const sumBenefits = document.getElementById('sumBenefits');

  if (sumPkg) sumPkg.textContent = pkg.name;
  if (sumGuests) sumGuests.textContent = `${currentGuests >= 350 ? '350+' : currentGuests} Personas`;
  if (sumGuisos) sumGuisos.textContent = `${selectedDishes.size} / ${limit}`;
  if (sumBenefits) sumBenefits.textContent = pkg.benefits;

  if (sumList) {
    if (selectedDishes.size === 0) {
      sumList.innerHTML = '<em>Selecciona tus cazuelas en las pastillas de la izquierda para armar tu menú.</em>';
    } else {
      let html = '<ol>';
      selectedDishes.forEach(d => {
        html += `<li>${d}</li>`;
      });
      html += '</ol>';
      if (selectedExtras.size > 0) {
        html += `<div style="margin-top: 10px; font-weight: 600; color: var(--color-pink-primary);">+ Extras: ${Array.from(selectedExtras).join(', ')}</div>`;
      }
      sumList.innerHTML = html;
    }
  }

  updateCounts();
}

window.sendToWhatsApp = function(event) {
  event.preventDefault();

  const custName = document.getElementById('custName') ? document.getElementById('custName').value.trim() : '';
  const custDate = document.getElementById('custDate') ? document.getElementById('custDate').value.trim() : '';
  const custCity = document.getElementById('custCity') ? document.getElementById('custCity').value.trim() : '';

  const pkg = PACKAGES[currentPackage];

  let dishesText = '';
  if (selectedDishes.size > 0) {
    let i = 1;
    selectedDishes.forEach(d => {
      dishesText += `  ${i}. ${d}%0A`;
      i++;
    });
  } else {
    dishesText = '  (Por acordar con Claudia)%0A';
  }

  const extrasText = selectedExtras.size > 0 ? Array.from(selectedExtras).join(', ') : 'Ninguno';

  const msg =
`¡Hola Claudia! Me gustaría cotizar un banquete con *La Lola*:%0A%0A` +
`👤 *Cliente:* ${custName}%0A` +
`📅 *Fecha estimada:* ${custDate}%0A` +
`📍 *Lugar / Salón:* ${custCity}%0A` +
`👥 *Invitados:* ${currentGuests >= 350 ? '350+' : currentGuests} personas%0A` +
`📦 *Paquete:* ${pkg.name}%0A` +
`🥘 *Cazuelas seleccionadas:*%0A${dishesText}` +
`✨ *Extras opcionales:* ${extrasText}%0A%0A` +
`¿Podrías confirmarme disponibilidad y enviarme la cotización formal? ¡Muchas gracias!`;

  const waUrl = `https://wa.me/524778020791?text=${msg}`;
  window.open(waUrl, '_blank');
};
