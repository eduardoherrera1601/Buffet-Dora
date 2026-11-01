(function() {
  'use strict';

  // Catálogo completo de los 32 Guisados del archivo original
  const dishes = [
    { name: "Puerco en chile morita", cat: "carnes", icon: "🥩" },
    { name: "Puerco en salsa 3 chiles", cat: "carnes", icon: "🥩" },
    { name: "Mole rojo con pollo", cat: "carnes", icon: "🍗" },
    { name: "Mole verde con pollo", cat: "carnes", icon: "🍗" },
    { name: "Bistec con nopales", cat: "carnes", icon: "🥩" },
    { name: "Bistec en chile pasilla", cat: "carnes", icon: "🥩" },
    { name: "Bistec a la mexicana", cat: "carnes", icon: "🥩" },
    { name: "Pollo a la mexicana", cat: "carnes", icon: "🍗" },
    { name: "Pollo en crema poblano", cat: "carnes", icon: "🍗" },
    { name: "Pollo crema chile güero", cat: "carnes", icon: "🍗" },
    { name: "Carne deshebrada", cat: "carnes", icon: "🥩" },
    { name: "Picadillo tradicional", cat: "carnes", icon: "🥩" },
    { name: "Rajas con crema", cat: "antojitos", icon: "🌶️" },
    { name: "Chorizo con papas", cat: "antojitos", icon: "🌶️" },
    { name: "Chorizo a la mexicana", cat: "antojitos", icon: "🌶️" },
    { name: "Chicharrón prensado", cat: "antojitos", icon: "🥓" },
    { name: "Chicharrón en salsa", cat: "antojitos", icon: "🥓" },
    { name: "Rellena tradicional", cat: "antojitos", icon: "🌶️" },
    { name: "Salchichas guisadas", cat: "antojitos", icon: "🌭" },
    { name: "Huevo con chile molcajete", cat: "antojitos", icon: "🍳" },
    { name: "Huevo con salchicha", cat: "antojitos", icon: "🍳" },
    { name: "Champiñones a la crema", cat: "verduras", icon: "🍄" },
    { name: "Champiñones al ajillo", cat: "verduras", icon: "🍄" },
    { name: "Nopales guisados", cat: "verduras", icon: "🌵" },
    { name: "Nopales en ensalada", cat: "verduras", icon: "🥗" },
    { name: "Papas guisadas", cat: "verduras", icon: "🥔" },
    { name: "Papas con nopales", cat: "verduras", icon: "🥔" },
    { name: "Garbanzos guisados", cat: "verduras", icon: "🫘" },
    { name: "Arroz blanco", cat: "bases", icon: "🍚" },
    { name: "Arroz rojo tradicional", cat: "bases", icon: "🍚" },
    { name: "Frijoles refritos", cat: "bases", icon: "🫘" },
    { name: "Frijoles de la olla", cat: "bases", icon: "🫘" }
  ];

  const packages = {
    '30-50': { name: 'Paquete Tradicional', max: 7, benefits: '7 guisados, botana, 1 vitrolero 20L y tortillas calientes.' },
    '50-80': { name: 'Paquete Fiesta Mexicana', max: 7, benefits: '7 guisados, botana con ensalada de cueritos, 2 vitroleros (40L) y tortillas a mano en comal.' },
    '80+': { name: 'Paquete Gran Banquete', max: 8, benefits: '8 guisados (¡1 cazuela más!), botana monumental completa, 2 vitroleros y tortillas a mano o máquina.' }
  };

  let currentPkg = '50-80';
  let guests = 65;
  const selectedDishes = new Set();
  const selectedExtras = new Set();

  const wrap = document.getElementById('pillsGrid');

  function renderDishes(filter = 'all') {
    if (!wrap) return;
    wrap.innerHTML = '';
    dishes.forEach(d => {
      if (filter === 'all' || d.cat === filter) {
        const pill = document.createElement('div');
        pill.className = 'dish-pill' + (selectedDishes.has(d.name) ? ' selected' : '');
        pill.innerHTML = `<span>${d.icon}</span> ${d.name}`;
        pill.onclick = () => toggleDish(d.name, pill);
        wrap.appendChild(pill);
      }
    });
  }

  function toggleDish(name, el) {
    const max = packages[currentPkg].max;
    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      el.classList.remove('selected');
    } else {
      if (selectedDishes.size >= max) {
        alert(`Tu paquete incluye hasta ${max} cazuelas. Quita una para cambiarla.`);
        return;
      }
      selectedDishes.add(name);
      el.classList.add('selected');
    }
    updateSummary();
  }

  window.filterDishes = function(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDishes(cat);
  };

  window.choosePackage = function(key) {
    currentPkg = key;
    document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`pkg-${key}`);
    if (target) target.classList.add('active');

    const max = packages[key].max;
    const limitEl = document.getElementById('cLimit');
    if (limitEl) limitEl.textContent = max;

    if (selectedDishes.size > max) {
      const arr = Array.from(selectedDishes);
      while (selectedDishes.size > max) selectedDishes.delete(arr.pop());
      renderDishes();
    }
    updateSummary();
  };

  window.onGuestSlider = function(val) {
    guests = val;
    const display = document.getElementById('guestDisplay');
    if (display) display.textContent = `${val} Personas`;

    if (val <= 50 && currentPkg !== '30-50') window.choosePackage('30-50');
    else if (val > 50 && val <= 80 && currentPkg !== '50-80') window.choosePackage('50-80');
    else if (val > 80 && currentPkg !== '80+') window.choosePackage('80+');
    updateSummary();
  };

  window.toggleExtra = function(el, name) {
    if (selectedExtras.has(name)) {
      selectedExtras.delete(name);
      el.classList.remove('selected');
    } else {
      selectedExtras.add(name);
      el.classList.add('selected');
    }
    updateSummary();
  };

  window.addSpecialty = function(name) {
    selectedExtras.add(name);
    const target = document.getElementById('armar');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    updateSummary();
  };

  function updateSummary() {
    const meta = packages[currentPkg];
    const sumPkg = document.getElementById('sumPkg');
    const sumGuests = document.getElementById('sumGuests');
    const sumGuisos = document.getElementById('sumGuisos');
    const cCount = document.getElementById('cCount');
    const sumBenefits = document.getElementById('sumBenefits');
    const sumList = document.getElementById('sumList');

    if (sumPkg) sumPkg.textContent = meta.name;
    if (sumGuests) sumGuests.textContent = `${guests} Personas`;
    if (sumGuisos) sumGuisos.textContent = `${selectedDishes.size} / ${meta.max}`;
    if (cCount) cCount.textContent = selectedDishes.size;
    if (sumBenefits) sumBenefits.textContent = meta.benefits;

    if (sumList) {
      if (selectedDishes.size === 0) {
        sumList.innerHTML = '<em>Selecciona tus cazuelas en las pastillas de la izquierda para armar tu menú.</em>';
      } else {
        sumList.innerHTML = '<ol>' + Array.from(selectedDishes).map(d => `<li><strong>${d}</strong></li>`).join('') + '</ol>';
      }
    }
  }

  window.sendToWhatsApp = function(e) {
    e.preventDefault();
    const nameEl = document.getElementById('custName');
    const dateEl = document.getElementById('custDate');
    const cityEl = document.getElementById('custCity');

    const name = nameEl ? nameEl.value.trim() : '';
    const date = dateEl ? dateEl.value : '';
    const city = cityEl ? cityEl.value.trim() : 'León, Gto.';
    const meta = packages[currentPkg];

    let guisosMsg = selectedDishes.size > 0
      ? '\n\n🍲 *Cazuelas Elegidas:*\n' + Array.from(selectedDishes).map((d, i) => `  ${i + 1}. ${d}`).join('\n')
      : '\n\n🍲 *Cazuelas:* ' + meta.max + ' cazuelas a convenir';

    let extrasMsg = selectedExtras.size > 0
      ? '\n\n✨ *Especialidades Agregadas:*\n' + Array.from(selectedExtras).map(x => `  • ${x}`).join('\n')
      : '';

    const text = `¡Hola Claudia! Me gustaría cotizar un banquete con *La Lola* 🌮🎉\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `👥 *Invitados:* ${guests} personas\n` +
      `📦 *Paquete:* ${meta.name}\n` +
      `📅 *Fecha:* ${date}\n` +
      `📍 *Ciudad / Lugar:* ${city}` +
      guisosMsg + extrasMsg +
      `\n\n¿Podrías confirmarme disponibilidad de fecha y presupuesto formal? ¡Gracias!`;

    window.open('https://wa.me/524778020791?text=' + encodeURIComponent(text), '_blank');
  };

  // Header scroll & Smooth anchors
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     HERO: PARALLAX 3D SPLIT & BOTONES MAGNÉTICOS (60 FPS)
     ========================================================================== */
  function initHeroParallax() {
    const heroSection = document.getElementById('heroSection');
    const heroContent = document.getElementById('heroContent');
    const heroVisual = document.getElementById('heroVisual');
    const heroFloatCard = document.getElementById('heroFloatCard');

    if (!heroSection || !heroContent || !heroVisual) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;
    let animId = null;

    heroSection.addEventListener('mouseenter', () => {
      isHovering = true;
      if (!animId) animId = requestAnimationFrame(render);
    });

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    heroSection.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    });

    function render() {
      // Suavizado Lerp a 60fps
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Efecto Split: El contenido textual se desplaza en dirección contraria
      heroContent.style.transform = `translate3d(${currentX * -22}px, ${currentY * -16}px, 0)`;

      // La imagen se desplaza con el cursor con inclinación tridimensional sutil
      const rotateY = currentX * 8;
      const rotateX = -currentY * 8;
      heroVisual.style.transform = `translate3d(${currentX * 24}px, ${currentY * 18}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

      // Capa flotante inferior con profundidad desacoplada
      if (heroFloatCard) {
        heroFloatCard.style.transform = `translate3d(${currentX * 14}px, ${currentY * 10}px, 0)`;
      }

      if (isHovering || Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
        heroContent.style.transform = '';
        heroVisual.style.transform = '';
        if (heroFloatCard) heroFloatCard.style.transform = '';
      }
    }
  }

  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 280);
      });
    });
  }

  /* ==========================================================================
     BENTO GRID: TILT 3D A 60 FPS & CONTROLES DE VIDEO
     ========================================================================== */
  function initBentoTilt() {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
      let animId = null;
      let targetX = 0, targetY = 0;
      let curX = 0, curY = 0;
      let isHover = false;

      card.addEventListener('mouseenter', () => {
        isHover = true;
        if (!animId) animId = requestAnimationFrame(tiltLoop);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width - 0.5;
        targetY = (e.clientY - rect.top) / rect.height - 0.5;
      });

      card.addEventListener('mouseleave', () => {
        isHover = false;
        targetX = 0;
        targetY = 0;
      });

      function tiltLoop() {
        curX += (targetX - curX) * 0.12;
        curY += (targetY - curY) * 0.12;

        const rotX = -curY * 13;
        const rotY = curX * 13;

        if (isHover) {
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1, 1, 1)`;
        }

        if (isHover || Math.abs(curX) > 0.001 || Math.abs(curY) > 0.001) {
          animId = requestAnimationFrame(tiltLoop);
        } else {
          animId = null;
          card.style.transform = '';
        }
      }
    });
  }

  // Controles de Video en Hover (Audio & Pantalla Completa)
  window.toggleVideoAudio = function() {
    const video = document.getElementById('eventVideo');
    const btn = document.getElementById('btnVideoAudio');
    if (!video || !btn) return;

    video.muted = !video.muted;
    const icon = btn.querySelector('.audio-icon');
    const label = btn.querySelector('.audio-label');

    if (video.muted) {
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'Activar Audio';
    } else {
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'Silenciar';
      video.play().catch(() => {});
    }
  };

  window.toggleVideoFullscreen = function() {
    const video = document.getElementById('eventVideo');
    if (!video) return;

    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Inicialización
  renderDishes();
  updateSummary();
  initHeroParallax();
  initMagneticButtons();
  initBentoTilt();
})();
