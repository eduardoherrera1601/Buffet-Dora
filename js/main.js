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

    // Microanimación de pulsación (scale pop)
    if (el) {
      el.classList.add('pop-anim');
      setTimeout(() => el.classList.remove('pop-anim'), 360);
    }

    if (selectedDishes.has(name)) {
      selectedDishes.delete(name);
      if (el) el.classList.remove('selected');
    } else {
      if (selectedDishes.size >= max) {
        alert(`Tu paquete incluye hasta ${max} cazuelas. Quita una para cambiarla.`);
        return;
      }
      selectedDishes.add(name);
      if (el) el.classList.add('selected');
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

  /* ==========================================================================
     CANASTA GOURMET & FEEDBACK INSTANTÁNEO (CONFETTI / DESTELLO MENTA)
     ========================================================================== */
  function updateBasket(meta) {
    const basket = document.getElementById('gourmetBasket');
    const bar = document.getElementById('basketProgressBar');
    const title = document.getElementById('basketTitle');
    const subtitle = document.getElementById('basketSubtitle');
    const icon = document.getElementById('basketIcon');

    if (!basket || !bar) return;

    const count = selectedDishes.size;
    const max = meta.max;
    const remaining = Math.max(0, max - count);
    const percent = Math.min(100, Math.round((count / max) * 100));

    bar.style.width = `${percent}%`;

    if (count === 0) {
      if (title) title.textContent = 'Canasta Gourmet en Vivo';
      if (subtitle) subtitle.textContent = `Te faltan ${max} cazuelas para completar tu paquete`;
      if (icon) icon.textContent = '🧺';
      basket.classList.remove('complete');
    } else if (remaining > 0) {
      if (title) title.textContent = `Canasta Gourmet (${count} de ${max})`;
      if (subtitle) subtitle.textContent = `Te falta${remaining > 1 ? 'n' : ''} ${remaining} cazuela${remaining > 1 ? 's' : ''} por elegir`;
      if (icon) icon.textContent = '🥘';
      basket.classList.remove('complete');
    } else {
      if (title) title.textContent = `¡Canasta Completa! (${max} de ${max})`;
      if (subtitle) subtitle.textContent = `Has seleccionado todas las cazuelas de tu ${meta.name}`;
      if (icon) icon.textContent = '🎉';
      basket.classList.add('complete');
    }
  }

  function triggerConfetti() {
    const comanda = document.getElementById('stickyComanda');
    if (!comanda) return;

    const colors = ['#0D827E', '#D94878', '#22C55E', '#D8F3F1', '#FCE8EF', '#F59E0B'];
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '28px';
    container.style.zIndex = '15';

    comanda.style.position = 'sticky';
    comanda.appendChild(container);

    for (let i = 0; i < 35; i++) {
      const particle = document.createElement('div');
      const size = Math.floor(Math.random() * 8) + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * 100;
      const destX = startX + (Math.random() * 40 - 20);
      const destY = Math.random() * 180 + 80;
      const rot = Math.random() * 720 - 360;
      const duration = Math.random() * 1000 + 1000;

      particle.style.cssText = `
        position: absolute;
        top: -10px;
        left: ${startX}%;
        width: ${size}px;
        height: ${size * (Math.random() > 0.5 ? 1 : 1.6)}px;
        background-color: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        opacity: 1;
        transition: transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}ms ease-out;
      `;

      container.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate3d(${destX - startX}px, ${destY}px, 0) rotate(${rot}deg)`;
        particle.style.opacity = '0';
      });
    }

    setTimeout(() => {
      container.remove();
    }, 2200);
  }

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

    // Actualizar Canasta Gourmet
    updateBasket(meta);

    // Feedback Instantáneo de Menú Completo
    const comanda = document.getElementById('stickyComanda');
    const celebrationSlot = document.getElementById('comandaCelebration');

    if (selectedDishes.size === meta.max) {
      if (comanda && !comanda.classList.contains('completed-glow')) {
        comanda.classList.add('completed-glow');
        triggerConfetti();
      }
      if (celebrationSlot && celebrationSlot.innerHTML === '') {
        celebrationSlot.innerHTML = `<div class="comanda-celebration-banner">✨ ¡Menú completo, listo para confirmar por WhatsApp!</div>`;
      }
    } else {
      if (comanda) comanda.classList.remove('completed-glow');
      if (celebrationSlot) celebrationSlot.innerHTML = '';
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
