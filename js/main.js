/**
 * LA LOLA • BANQUETES & CATERING TRADICIONAL
 * Arquitectura Interactiva: Pin-Scroll Cinematic Viewport & Menú de Degustación
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. CATÁLOGO COMPLETO DE LOS 32 GUISADOS TRADICIONALES
     ========================================================================== */
  const dishes = [
    { name: "Mole rojo con pollo", cat: "carnes", num: "01", desc: "Receta tradicional con pollo tierno deshebrado" },
    { name: "Mole verde con pollo", cat: "carnes", num: "02", desc: "Pepita verde molida, hierbas frescas y pollo" },
    { name: "Puerco en chile morita", cat: "carnes", num: "03", desc: "Trozos de lomo suave en salsa ahumada de morita" },
    { name: "Puerco en salsa 3 chiles", cat: "carnes", num: "04", desc: "Combinación de anchos, guajillos y pasillas" },
    { name: "Bistec con nopales", cat: "carnes", num: "05", desc: "Tiras de res en cazuela con nopales tiernos" },
    { name: "Bistec en chile pasilla", cat: "carnes", num: "06", desc: "Carne de res jugosa en adobo negro de pasilla" },
    { name: "Bistec a la mexicana", cat: "carnes", num: "07", desc: "Jitomate, cebolla y serrano picado al fuego" },
    { name: "Pollo a la mexicana", cat: "carnes", num: "08", desc: "Pollo en salsa rústica con jitomate y chiles" },
    { name: "Pollo en crema poblano", cat: "carnes", num: "09", desc: "Rajas poblanas tatemadas con crema de rancho" },
    { name: "Pollo crema chile güero", cat: "carnes", num: "10", desc: "Salsa cremosa suave con chile caribeño güero" },
    { name: "Carne deshebrada", cat: "carnes", num: "11", desc: "Falda de res deshebrada sazonada con orégano" },
    { name: "Picadillo tradicional", cat: "carnes", num: "12", desc: "Carne molida con papa y zanahoria al vapor" },
    { name: "Rajas con crema", cat: "antojitos", num: "13", desc: "Chile poblano asado con crema espesa y elote" },
    { name: "Chorizo con papas", cat: "antojitos", num: "14", desc: "Chorizo doradito con cubos de papa tierna" },
    { name: "Chorizo a la mexicana", cat: "antojitos", num: "15", desc: "Embutido artesanal guisado con verdura fresca" },
    { name: "Chicharrón prensado", cat: "antojitos", num: "16", desc: "Fritura de cerdo guisada en salsa de guajillo" },
    { name: "Chicharrón en salsa", cat: "antojitos", num: "17", desc: "Corteza inflada en salsa verde tatemada" },
    { name: "Rellena tradicional", cat: "antojitos", num: "18", desc: "Moronga sazonada con hierbabuena y cebolla" },
    { name: "Salchichas guisadas", cat: "antojitos", num: "19", desc: "Salchichas en salsa roja de chipotle casero" },
    { name: "Huevo con chile molcajete", cat: "antojitos", num: "20", desc: "Huevos revueltos bañados en salsa martajada" },
    { name: "Huevo con salchicha", cat: "antojitos", num: "21", desc: "Desayuno clásico de cazuela caliente" },
    { name: "Champiñones a la crema", cat: "verduras", num: "22", desc: "Hongos frescos laminados con crema y epazote" },
    { name: "Champiñones al ajillo", cat: "verduras", num: "23", desc: "Ajo dorado en aceite de oliva y chile guajillo" },
    { name: "Nopales guisados", cat: "verduras", num: "24", desc: "Nopales con cebolla y orégano de monte" },
    { name: "Nopales en ensalada", cat: "verduras", num: "25", desc: "Frescos con jitomate, cilantro y queso de rancho" },
    { name: "Papas guisadas", cat: "verduras", num: "26", desc: "Papas en adobo ligero con comino y laurel" },
    { name: "Papas con nopales", cat: "verduras", num: "27", desc: "Guisado campero tradicional en cazuela" },
    { name: "Garbanzos guisados", cat: "verduras", num: "28", desc: "Leguminosas cocidas a fuego lento con recaudo" },
    { name: "Arroz blanco", cat: "bases", num: "29", desc: "Arroz esponjado con elote y mantequilla" },
    { name: "Arroz rojo tradicional", cat: "bases", num: "30", desc: "Arroz con jitomate de rancho y verduras" },
    { name: "Frijoles refritos", cat: "bases", num: "31", desc: "Frijol bayo refrito con manteca y epazote" },
    { name: "Frijoles de la olla", cat: "bases", num: "32", desc: "Caldo de frijol recién hervido en barro curado" }
  ];

  const packages = {
    '30-50': { name: 'Paquete Tradicional', max: 7, desc: '30 a 50 personas • 7 Guisos' },
    '50-80': { name: 'Paquete Fiesta Mexicana', max: 7, desc: '50 a 80 personas • 7 Guisos' },
    '80+': { name: 'Paquete Gran Banquete', max: 8, desc: '80+ personas • 8 Guisos' }
  };

  let currentPkgKey = '50-80';
  let guestCount = 65;
  const selectedDishes = new Set();
  const selectedSpecialties = new Set();
  let currentFilter = 'all';

  /* ==========================================================================
     2. PIN-SCROLL CINEMATIC STAGE (PANTALLA FIJA CON RELEVO SCROLL-DRIVEN)
     ========================================================================== */
  function initPinScroll() {
    const container = document.getElementById('historia');
    const stage = document.getElementById('pinStage');
    const dots = document.querySelectorAll('.pin-dot-step');
    const slides = [
      document.getElementById('slide-0'),
      document.getElementById('slide-1'),
      document.getElementById('slide-2')
    ];
    const narratives = [
      document.getElementById('narrative-0'),
      document.getElementById('narrative-1'),
      document.getElementById('narrative-2')
    ];

    if (!container || !stage) return;

    let currentStep = 0;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePinState();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updatePinState() {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      
      if (totalScrollable <= 0) return;

      // Progreso de 0.0 a 1.0 dentro de la sección fijada
      const rawProgress = -rect.top / totalScrollable;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      // Determinación de la etapa activa (0, 1 o 2)
      let activeStep = 0;
      if (progress >= 0.62) {
        activeStep = 2;
      } else if (progress >= 0.31) {
        activeStep = 1;
      } else {
        activeStep = 0;
      }

      if (activeStep !== currentStep) {
        currentStep = activeStep;
        applyStepVisuals(activeStep);
      }
    }

    function applyStepVisuals(step) {
      // Diapositivas
      slides.forEach((s, idx) => {
        if (!s) return;
        if (idx === step) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      // Textos Narrativos
      narratives.forEach((n, idx) => {
        if (!n) return;
        if (idx === step) {
          n.classList.add('active');
        } else {
          n.classList.remove('active');
        }
      });

      // Indicadores laterales de puntos
      dots.forEach((d, idx) => {
        if (idx === step) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    }

    window.scrollToPinStep = function(targetStep) {
      const containerTop = container.offsetTop;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const stepTarget = containerTop + (targetStep / 2) * totalScrollable;
      window.scrollTo({ top: stepTarget + 10, behavior: 'smooth' });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updatePinState();
  }

  /* ==========================================================================
     3. MENÚ DE DEGUSTACIÓN EDITORIAL (RENDERIZADO Y SELECCIÓN DE GUISADOS)
     ========================================================================== */
  function renderTastingMenu(filter = 'all') {
    currentFilter = filter;
    const listWrap = document.getElementById('tastingMenuList');
    if (!listWrap) return;

    listWrap.innerHTML = '';
    const filtered = dishes.filter(d => filter === 'all' || d.cat === filter);

    filtered.forEach(d => {
      const isServed = selectedDishes.has(d.name);
      const row = document.createElement('div');
      row.className = 'tasting-dish-row' + (isServed ? ' is-served' : '');
      row.setAttribute('data-name', d.name);
      row.setAttribute('data-category', d.cat);

      row.innerHTML = `
        <div class="tasting-dish-left">
          <span class="tasting-dish-num">${d.num}</span>
          <span class="tasting-dish-title">${d.name}</span>
          <span class="tasting-dish-tag-served">Servido en cazuela</span>
        </div>
        <div class="tasting-dish-action-sign">${isServed ? '✕' : '+'}</div>
      `;

      row.addEventListener('click', () => toggleTastingDish(d.name, row));
      listWrap.appendChild(row);
    });
  }

  function toggleTastingDish(name, rowEl) {
    const max = packages[currentPkgKey].max;

    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      if (rowEl) {
        rowEl.classList.remove('is-served');
        const sign = rowEl.querySelector('.tasting-dish-action-sign');
        if (sign) sign.textContent = '+';
      }
    } else {
      if (selectedDishes.size >= max) {
        alert(`Tu paquete incluye hasta ${max} cazuelas. Retira alguna si deseas cambiarla.`);
        return;
      }
      selectedDishes.add(name);
      if (rowEl) {
        rowEl.classList.add('is-served');
        const sign = rowEl.querySelector('.tasting-dish-action-sign');
        if (sign) sign.textContent = '✕';
      }
    }

    updateComandaState();
  }

  window.filterTastingMenu = function(cat, btn) {
    document.querySelectorAll('.tasting-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderTastingMenu(cat);
  };

  /* ==========================================================================
     4. ESPECIALIDADES DE FONDA
     ========================================================================== */
  window.toggleSpecialtyItem = function(name, btn) {
    if (selectedSpecialties.has(name)) {
      selectedSpecialties.delete(name);
      if (btn) {
        btn.classList.remove('is-active');
        btn.textContent = '+ Incluir en Comanda';
      }
    } else {
      selectedSpecialties.add(name);
      if (btn) {
        btn.classList.add('is-active');
        btn.textContent = '✓ Servido en Comanda';
      }
    }

    updateComandaState();
  };

  /* ==========================================================================
     5. COMANDA FLOTANTE DE RESERVA & LÓGICA DE PAQUETES
     ========================================================================== */
  window.selectComandaPackage = function(pkgKey) {
    currentPkgKey = pkgKey;
    document.querySelectorAll('.comanda-pkg-btn').forEach(b => b.classList.remove('active'));
    
    const targetBtn = document.getElementById(`btn-pkg-${pkgKey}`);
    if (targetBtn) targetBtn.classList.add('active');

    const max = packages[pkgKey].max;
    const badge = document.getElementById('currentPkgLimitDisplay');
    if (badge) badge.textContent = `${max} Cazuelas`;

    // Si se redujo el límite y hay más guisados de los permitidos
    if (selectedDishes.size > max) {
      const arr = Array.from(selectedDishes);
      while (selectedDishes.size > max) {
        selectedDishes.delete(arr.pop());
      }
      renderTastingMenu(currentFilter);
    }

    updateComandaState();
  };

  window.onGuestDialChange = function(val) {
    guestCount = parseInt(val, 10);
    const display = document.getElementById('dialGuestCount');
    if (display) display.textContent = `${val} Personas`;

    // Sincronizar paquete sugerido automáticamente
    if (guestCount <= 50 && currentPkgKey !== '30-50') {
      window.selectComandaPackage('30-50');
    } else if (guestCount > 50 && guestCount <= 80 && currentPkgKey !== '50-80') {
      window.selectComandaPackage('50-80');
    } else if (guestCount > 80 && currentPkgKey !== '80+') {
      window.selectComandaPackage('80+');
    }

    updateComandaState();
  };

  function updateComandaState() {
    const pkg = packages[currentPkgKey];
    const countDisplay = document.getElementById('comandaCountDisplay');
    const fillBar = document.getElementById('comandaProgressFill');
    const dishesList = document.getElementById('comandaDishesList');
    const specSlot = document.getElementById('comandaSpecialtiesSlot');
    const specList = document.getElementById('comandaSpecialtiesList');

    const count = selectedDishes.size;
    const max = pkg.max;

    if (countDisplay) countDisplay.textContent = `${count} de ${max}`;

    if (fillBar) {
      const pct = Math.min(100, Math.round((count / max) * 100));
      fillBar.style.width = `${pct}%`;
    }

    // Lista ordenada de guisados en la comanda
    if (dishesList) {
      if (selectedDishes.size === 0) {
        dishesList.innerHTML = `<li class="comanda-empty-cue">Selecciona tus platillos en el menú de degustación a la izquierda.</li>`;
      } else {
        dishesList.innerHTML = '';
        let idx = 1;
        selectedDishes.forEach(name => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span><strong>${idx < 10 ? '0' + idx : idx}.</strong> ${name}</span>
            <button type="button" class="comanda-dish-remove-btn" title="Quitar de comanda" onclick="removeDishFromComanda('${name}')">✕</button>
          `;
          dishesList.appendChild(li);
          idx++;
        });
      }
    }

    // Especialidades en comanda
    if (specSlot && specList) {
      if (selectedSpecialties.size === 0) {
        specSlot.style.display = 'none';
        specList.innerHTML = '';
      } else {
        specSlot.style.display = 'block';
        specList.innerHTML = '';
        selectedSpecialties.forEach(sp => {
          const li = document.createElement('li');
          li.innerHTML = `<span>✨ ${sp}</span>`;
          specList.appendChild(li);
        });
      }
    }
  }

  window.removeDishFromComanda = function(name) {
    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      renderTastingMenu(currentFilter);
      updateComandaState();
    }
  };

  /* ==========================================================================
     6. COMPILACIÓN FORMAL DE WHATSAPP PARA CLAUDIA
     ========================================================================== */
  window.confirmOrderWhatsApp = function(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('orderCustName');
    const dateInput = document.getElementById('orderCustDate');
    const cityInput = document.getElementById('orderCustCity');

    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Cliente interesado';
    const date = dateInput && dateInput.value ? dateInput.value : 'Por definir';
    const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : 'León, Gto.';
    const pkg = packages[currentPkgKey];

    let dishesText = selectedDishes.size > 0
      ? '\n\n🍲 *Guisados Elegidos para Comanda (' + selectedDishes.size + ' de ' + pkg.max + '):*\n' + 
        Array.from(selectedDishes).map((d, i) => `  ${i + 1 < 10 ? '0' + (i + 1) : i + 1}. ${d}`).join('\n')
      : '\n\n🍲 *Guisados:* ' + pkg.max + ' cazuelas tradicionales a convenir';

    let specialtiesText = selectedSpecialties.size > 0
      ? '\n\n✨ *Especialidades Adicionales:*\n' + 
        Array.from(selectedSpecialties).map(s => `  • ${s}`).join('\n')
      : '';

    const message = `¡Hola Claudia! Me gustaría solicitar cotización formal para un banquete con *La Lola* 🌮🎉\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `👥 *Invitados:* ${guestCount} personas\n` +
      `📦 *Paquete Seleccionado:* ${pkg.name} (${pkg.desc})\n` +
      `📅 *Fecha Estimada:* ${date}\n` +
      `📍 *Ciudad / Lugar:* ${city}` +
      dishesText + specialtiesText +
      `\n\n¿Podrías confirmarme disponibilidad de fecha y el presupuesto final? ¡Muchas gracias!`;

    const waUrl = 'https://wa.me/524778020791?text=' + encodeURIComponent(message);
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
     7. INICIALIZACIÓN ROBUSTA EN DOMContentLoaded
     ========================================================================== */
  function init() {
    initPinScroll();
    renderTastingMenu('all');
    updateComandaState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
