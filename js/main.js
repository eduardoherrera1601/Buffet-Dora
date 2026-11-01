/**
 * LA LOLA • BANQUETES & CATERING TRADICIONAL
 * Script Principal de Scrollytelling, Visor de Especialidades y Menú de Degustación
 */

(function() {
  'use strict';

  // Configuración de los 3 Paquetes
  const packages = {
    '30-50': { 
      name: 'Paquete Tradicional', 
      max: 7, 
      range: '30 a 50 personas',
      perks: '7 guisados calientes, botana tradicional de rancho, 1 vitrolero de agua fresca natural (20L) y tortillas calientes al momento.' 
    },
    '50-80': { 
      name: 'Paquete Fiesta Mexicana', 
      max: 7, 
      range: '50 a 80 personas',
      perks: '7 guisados calientes, botana tradicional con ensalada de cueritos, 2 vitroleros de agua fresca natural (40L) y tortillas a mano en comal vivo.' 
    },
    '80+': { 
      name: 'Paquete Gran Banquete', 
      max: 8, 
      range: '80+ personas',
      perks: '8 guisados calientes (¡1 cazuela más!), botana monumental completa, 2 vitroleros de agua natural (40L) y servicio continuo en comal.' 
    }
  };

  let currentPkgKey = '50-80';
  let guestCount = 65;
  const selectedDishes = new Set();
  const selectedSpecialties = new Set();

  /* ==========================================================================
     1. SCROLLYTELLING EN PANTALLA COMPLETA (#historia)
     ========================================================================== */
  function initScrollytelling() {
    const container = document.getElementById('historia');
    const stage = document.getElementById('scrollyStage');
    const layers = [
      document.getElementById('layer-0'),
      document.getElementById('layer-1'),
      document.getElementById('layer-2')
    ];
    const medias = [
      document.getElementById('media-0'),
      document.getElementById('media-1'),
      document.getElementById('media-2')
    ];
    const dots = [
      document.getElementById('dot-0'),
      document.getElementById('dot-1'),
      document.getElementById('dot-2')
    ];

    if (!container || !stage) return;

    let currentStep = -1;
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollyProgress();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateScrollyProgress() {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      // Progreso normalizado de 0 a 1
      const rawProgress = -rect.top / totalScrollable;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      // 0% - 33%: Capa 0 | 34% - 66%: Capa 1 | 67% - 100%: Capa 2
      let activeStep = 0;
      if (progress > 0.66) {
        activeStep = 2;
      } else if (progress > 0.33) {
        activeStep = 1;
      } else {
        activeStep = 0;
      }

      if (activeStep !== currentStep) {
        currentStep = activeStep;
        applyStep(activeStep);
      }
    }

    function applyStep(step) {
      // Alternar medios derechos
      medias.forEach((m, idx) => {
        if (!m) return;
        if (idx === step) m.classList.add('active');
        else m.classList.remove('active');
      });

      // Alternar textos sincronizados izquierdos
      layers.forEach((l, idx) => {
        if (!l) return;
        if (idx === step) l.classList.add('active');
        else l.classList.remove('active');
      });

      // Alternar puntos de progreso
      dots.forEach((d, idx) => {
        if (!d) return;
        if (idx === step) d.classList.add('active');
        else d.classList.remove('active');
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollyProgress();
  }

  /* ==========================================================================
     2. ESPECIALIDADES DE LA CASA (VISOR INTERACTIVO SHOWCASE TABS)
     ========================================================================== */
  window.switchSpecialtyTab = function(key, btn) {
    document.querySelectorAll('.spec-tab, .spec-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
    } else {
      const match = document.querySelector(`.spec-tab[data-target="${key}"], .spec-tab-btn[data-target="${key}"]`);
      if (match) match.classList.add('active');
    }

    const views = document.querySelectorAll('.specialty-panel-view');
    views.forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    const activeView = document.getElementById(`spec-view-${key}`);
    if (activeView) {
      activeView.style.display = 'grid';
      void activeView.offsetWidth; // Forzar reflow para disparo suave de fade-in
      activeView.classList.add('active');
    }
  };

  window.addSpecialtyToOrder = function(name, btn) {
    selectedSpecialties.add(name);

    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = '✓ ¡Agregado a tu Cotización!';
      btn.style.background = 'var(--pastel-menta-deep)';
      btn.style.borderColor = 'var(--pastel-menta-deep)';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2200);
    }

    updateComandaUI();
  };

  /* ==========================================================================
     3. FILTRADO Y SELECCIÓN DEL MENÚ DE DEGUSTACIÓN (#degustacion)
     ========================================================================== */
  window.applyDishCategoryFilter = function(cat, btn) {
    document.querySelectorAll('.filter-btn, .cat-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
    } else {
      const match = document.querySelector(`.filter-btn[data-filter="${cat}"], .cat-filter-btn[data-filter="${cat}"]`);
      if (match) match.classList.add('active');
    }

    const dishes = document.querySelectorAll('#tastingDishesContainer .dish-entry');
    dishes.forEach(dish => {
      const dishCat = dish.getAttribute('data-category');
      if (cat === 'all' || dishCat === cat) {
        dish.style.display = 'flex';
      } else {
        dish.style.display = 'none';
      }
    });
  };

  window.toggleDishSelection = function(name, rowEl) {
    const max = packages[currentPkgKey].max;
    const warningEl = document.getElementById('limitNoticeMsg');

    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      if (rowEl) {
        rowEl.classList.remove('selected');
        const sign = rowEl.querySelector('.dish-entry-sign');
        if (sign) sign.textContent = '+';
      }
      if (warningEl) warningEl.style.display = 'none';
    } else {
      if (selectedDishes.size >= max) {
        if (warningEl) {
          warningEl.style.display = 'block';
          warningEl.textContent = `Has alcanzado el límite de ${max} cazuelas de tu paquete. Quita una para elegir otra.`;
          setTimeout(() => {
            if (warningEl) warningEl.style.display = 'none';
          }, 3500);
        }
        return;
      }

      selectedDishes.add(name);
      if (rowEl) {
        rowEl.classList.add('selected');
        const sign = rowEl.querySelector('.dish-entry-sign');
        if (sign) sign.textContent = '✕';
      }
      if (warningEl) warningEl.style.display = 'none';
    }

    updateComandaUI();
  };

  /* ==========================================================================
     4. COMANDA LATERAL & LÓGICA DE PAQUETES
     ========================================================================== */
  window.choosePackagePlan = function(pkgKey) {
    currentPkgKey = pkgKey;
    document.querySelectorAll('.pkg-nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetBtn = document.getElementById(`btn-pkg-${pkgKey}`);
    if (targetBtn) targetBtn.classList.add('active');

    const pkg = packages[pkgKey];
    const max = pkg.max;
    
    const maxDisplay = document.getElementById('pkgLimitMaxDisplay');
    if (maxDisplay) maxDisplay.textContent = `${max} Cazuelas`;

    const perksBox = document.getElementById('comandaPerksBox');
    if (perksBox) {
      perksBox.innerHTML = `<strong>Incluye:</strong> ${pkg.perks}`;
    }

    // Si se redujo el límite y hay más guisados seleccionados
    if (selectedDishes.size > max) {
      const arr = Array.from(selectedDishes);
      while (selectedDishes.size > max) {
        const removed = arr.pop();
        selectedDishes.delete(removed);
        const row = document.querySelector(`.dish-entry[data-name="${removed}"]`);
        if (row) {
          row.classList.remove('selected');
          const sign = row.querySelector('.dish-entry-sign');
          if (sign) sign.textContent = '+';
        }
      }
    }

    updateComandaUI();
  };

  window.handleGuestSlider = function(val) {
    guestCount = parseInt(val, 10);
    const label = document.getElementById('guestCountLabel');
    if (label) label.textContent = `${val} Personas`;

    // Sincronización automática de paquete sugerido
    if (guestCount <= 50 && currentPkgKey !== '30-50') {
      window.choosePackagePlan('30-50');
    } else if (guestCount > 50 && guestCount <= 80 && currentPkgKey !== '50-80') {
      window.choosePackagePlan('50-80');
    } else if (guestCount > 80 && currentPkgKey !== '80+') {
      window.choosePackagePlan('80+');
    }

    updateComandaUI();
  };

  window.removeDishFromOrder = function(name) {
    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      const row = document.querySelector(`.dish-entry[data-name="${name}"]`);
      if (row) {
        row.classList.remove('selected');
        const sign = row.querySelector('.dish-entry-sign');
        if (sign) sign.textContent = '+';
      }
      updateComandaUI();
    }
  };

  function updateComandaUI() {
    const pkg = packages[currentPkgKey];
    const counter = document.getElementById('comandaDishesCounter');
    const bar = document.getElementById('comandaProgressBar');
    const listUl = document.getElementById('comandaSelectedUl');

    const count = selectedDishes.size;
    const max = pkg.max;

    if (counter) counter.textContent = `${count} de ${max}`;

    if (bar) {
      const percent = Math.min(100, Math.round((count / max) * 100));
      bar.style.width = `${percent}%`;
    }

    if (listUl) {
      if (selectedDishes.size === 0 && selectedSpecialties.size === 0) {
        listUl.innerHTML = `<li class="comanda-empty-notice">Selecciona tus platillos en el menú de degustación a la izquierda.</li>`;
      } else {
        listUl.innerHTML = '';

        // Guisados en Cursiva Elegante
        let idx = 1;
        selectedDishes.forEach(name => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${idx < 10 ? '0' + idx : idx}. <em>${name}</em></span>
            <button type="button" class="comanda-remove-item-btn" title="Quitar cazuela" onclick="removeDishFromOrder('${name}')">✕</button>
          `;
          listUl.appendChild(li);
          idx++;
        });

        // Especialidades agregadas
        selectedSpecialties.forEach(sp => {
          const li = document.createElement('li');
          li.style.color = 'var(--pastel-menta-deep)';
          li.innerHTML = `
            <span>✨ <em>${sp}</em></span>
            <button type="button" class="comanda-remove-item-btn" title="Quitar especialidad" onclick="removeSpecialtyFromOrder('${sp}')">✕</button>
          `;
          listUl.appendChild(li);
        });
      }
    }
  }

  window.removeSpecialtyFromOrder = function(sp) {
    selectedSpecialties.delete(sp);
    updateComandaUI();
  };

  /* ==========================================================================
     5. COMPILACIÓN FORMAL DE WHATSAPP PARA CLAUDIA AL 477 802 0791
     ========================================================================== */
  window.submitComandaWhatsApp = function(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('guestNameInput');
    const dateInput = document.getElementById('eventDateInput');
    const cityInput = document.getElementById('eventCityInput');

    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Cliente interesado';
    const date = dateInput && dateInput.value ? dateInput.value : 'Por definir';
    const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : 'León, Gto.';
    const pkg = packages[currentPkgKey];

    let dishesText = selectedDishes.size > 0
      ? '\n\n🍲 *Cazuelas Elegidas (' + selectedDishes.size + ' de ' + pkg.max + '):*\n' + 
        Array.from(selectedDishes).map((d, i) => `  ${i + 1 < 10 ? '0' + (i + 1) : i + 1}. ${d}`).join('\n')
      : '\n\n🍲 *Cazuelas:* ' + pkg.max + ' cazuelas tradicionales a convenir';

    let specialtiesText = selectedSpecialties.size > 0
      ? '\n\n✨ *Especialidades Agregadas:*\n' + 
        Array.from(selectedSpecialties).map(s => `  • ${s}`).join('\n')
      : '';

    const text = `¡Hola Claudia! Me gustaría cotizar un banquete tradicional con *La Lola* 🌮🎉\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `👥 *Invitados:* ${guestCount} personas\n` +
      `📦 *Paquete:* ${pkg.name} (${pkg.range})\n` +
      `📅 *Fecha:* ${date}\n` +
      `📍 *Ciudad / Lugar:* ${city}` +
      dishesText + specialtiesText +
      `\n\n¿Podrías confirmarme disponibilidad de fecha y el presupuesto formal? ¡Muchas gracias!`;

    const waUrl = 'https://wa.me/524778020791?text=' + encodeURIComponent(text);
    window.open(waUrl, '_blank');
  };

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    const header = document.getElementById('siteHeader');
    if (header) {
      if (window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     6. INICIALIZACIÓN ROBUSTA DENTRO DE DOMContentLoaded
     ========================================================================== */
  let isReady = false;

  function initApp() {
    if (isReady) return;
    isReady = true;

    // Listeners para pestañas de especialidades
    document.querySelectorAll('.spec-tab, .spec-tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (target) window.switchSpecialtyTab(target, this);
      });
    });

    // Listeners para botones de filtro
    document.querySelectorAll('.filter-btn, .cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        if (filter) window.applyDishCategoryFilter(filter, this);
      });
    });

    initScrollytelling();
    updateComandaUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
