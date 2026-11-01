/**
 * COLEÇÃO SACRA 3D - Interactive Scripts
 * Mobile-First, High Conversion Optimizations & Smart Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CRONÔMETRO DE URGÊNCIA (24 Horas - Horário de Brasília GMT-3)
  const timerElements = [
    document.getElementById('countdown-timer'),
    document.getElementById('countdown-timer-sub')
  ].filter(Boolean);

  function updateBrasiliaTimer() {
    const now = new Date();
    // Convert to Brasília Time (UTC - 3h)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brasiliaTime = new Date(utcTime - (3 * 3600000));

    // End of day in Brasília (23:59:59)
    const endOfDay = new Date(brasiliaTime);
    endOfDay.setHours(23, 59, 59, 999);

    let diffSeconds = Math.floor((endOfDay.getTime() - brasiliaTime.getTime()) / 1000);
    if (diffSeconds < 0) {
      diffSeconds = 24 * 3600 - 1; // reset cycle
    }

    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;

    timerElements.forEach(el => {
      el.textContent = formattedTime;
    });
  }

  setInterval(updateBrasiliaTimer, 1000);
  updateBrasiliaTimer();

  // 2. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const ans = otherItem.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      }
    });
  });

  // Open first FAQ item by default for UX
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstAns = faqItems[0].querySelector('.faq-answer');
    if (firstAns) {
      firstAns.style.maxHeight = firstAns.scrollHeight + 30 + 'px';
    }
  }

  // 3. SMOOTH SCROLL FOR IN-PAGE CTA LINKS (ex: #planos)
  const ctaLinks = document.querySelectorAll('a[href^="#"]');
  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ==========================================
  // CARROSSEL AUTOMÁTICO INFINITO (HERO SECTION)
  // ==========================================
  const carouselContainer = document.getElementById('hero-carousel-container');
  const carouselTrack = document.getElementById('hero-carousel-track');

  if (carouselContainer && carouselTrack) {
    // Clonar os cards originais para garantir rotação infinita contínua
    const originalCards = Array.from(carouselTrack.children);
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      carouselTrack.appendChild(clone);
    });

    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let scrollPos = carouselContainer.scrollLeft;
    const speed = 0.85; // Velocidade suave e fluida contínua

    function getOriginalWidth() {
      return carouselTrack.scrollWidth / 2;
    }

    function animateCarousel() {
      if (!isPaused && !isDragging) {
        scrollPos += speed;
        const origWidth = getOriginalWidth();
        if (origWidth > 0 && scrollPos >= origWidth) {
          scrollPos -= origWidth;
        }
        carouselContainer.scrollLeft = scrollPos;
      } else {
        scrollPos = carouselContainer.scrollLeft;
      }
      requestAnimationFrame(animateCarousel);
    }

    // Iniciar animação
    requestAnimationFrame(animateCarousel);

    // Pausar no Hover (Desktop)
    carouselContainer.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    carouselContainer.addEventListener('mouseleave', () => {
      if (!isDragging) {
        isPaused = false;
      }
    });

    // Navegação Manual por Arraste com Mouse (Desktop)
    carouselContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      isPaused = true;
      startX = e.pageX - carouselContainer.offsetLeft;
      scrollStart = carouselContainer.scrollLeft;
      carouselContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        isPaused = false;
        carouselContainer.style.cursor = 'grab';
        scrollPos = carouselContainer.scrollLeft;
      }
    });

    carouselContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carouselContainer.offsetLeft;
      const walk = (x - startX) * 1.6;
      carouselContainer.scrollLeft = scrollStart - walk;
      scrollPos = carouselContainer.scrollLeft;
    });

    // Navegação Manual por Toque / Swipe (Mobile)
    let touchResumeTimeout = null;

    carouselContainer.addEventListener('touchstart', () => {
      isPaused = true;
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
      touchResumeTimeout = setTimeout(() => {
        isPaused = false;
        scrollPos = carouselContainer.scrollLeft;
      }, 1500);
    }, { passive: true });

    // Loop sem saltos na rolagem manual (Touch e Mouse)
    carouselContainer.addEventListener('scroll', () => {
      const origWidth = getOriginalWidth();
      if (origWidth > 0) {
        if (carouselContainer.scrollLeft >= origWidth) {
          carouselContainer.scrollLeft -= origWidth;
          scrollPos = carouselContainer.scrollLeft;
        } else if (carouselContainer.scrollLeft <= 0) {
          carouselContainer.scrollLeft += origWidth;
          scrollPos = carouselContainer.scrollLeft;
        }
      }
    }, { passive: true });
  }

  // 4. MOBILE STICKY BAR VISIBILITY OBSERVER
  const pricingSection = document.getElementById('planos');
  const mobileBar = document.querySelector('.mobile-sticky-bar');

  if (pricingSection && mobileBar && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileBar.style.opacity = '0';
          mobileBar.style.pointerEvents = 'none';
        } else {
          mobileBar.style.opacity = '1';
          mobileBar.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.15 });

    observer.observe(pricingSection);
  }

  // ==========================================
  // 5. MODAL SYSTEM (UPSELL & INATIVIDADE)
  // ==========================================
  const modalUpsell = document.getElementById('modal-upsell');
  const modalInactivity = document.getElementById('modal-inactivity');
  const btnBuyBasic = document.getElementById('btn-buy-basic');
  const btnUpsellDismiss = document.getElementById('btn-upsell-dismiss');
  const diffPriceSpan = document.getElementById('upsell-diff-price');
  const diffTagSpan = document.getElementById('upsell-diff-tag');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-backdrop.active')) {
      document.body.classList.remove('modal-open');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      closeModal(modal);
    });
  }

  // Fechar ao clicar no backdrop ou botão de fechar
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.closest('[data-close-modal]')) {
        closeModal(backdrop);
      }
    });
  });

  // Fechar ao pressionar tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ------------------------------------------
  // A) UPSELL INTELIGENTE NO CLIQUE DO PLANO BÁSICO
  // ------------------------------------------
  const PROMO_COMPLETO_PRICE = 26.90;

  if (btnBuyBasic && modalUpsell) {
    btnBuyBasic.addEventListener('click', (e) => {
      e.preventDefault();

      // Cálculo dinâmico da diferença
      const rawPrice = btnBuyBasic.getAttribute('data-price');
      const basicPrice = parseFloat(rawPrice) || 16.90;
      let difference = PROMO_COMPLETO_PRICE - basicPrice;
      if (difference < 0) difference = 10.00;

      const formattedDiff = difference.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      if (diffPriceSpan) diffPriceSpan.textContent = `R$ ${formattedDiff}`;
      if (diffTagSpan) diffTagSpan.textContent = `R$ ${formattedDiff}`;

      openModal(modalUpsell);
    });
  }

  // Link de recusa do Upsell
  if (btnUpsellDismiss) {
    btnUpsellDismiss.addEventListener('click', () => {
      closeModal(modalUpsell);
      // Navega normalmente para o checkout do Plano Básico
    });
  }

  // Link de aceite do Upsell
  const btnUpsellAccept = document.getElementById('btn-upsell-accept');
  if (btnUpsellAccept) {
    btnUpsellAccept.addEventListener('click', () => {
      closeModal(modalUpsell);
    });
  }

  // Link de aceite da retenção por inatividade
  const btnInactivityAccept = document.getElementById('btn-inactivity-accept');
  if (btnInactivityAccept) {
    btnInactivityAccept.addEventListener('click', () => {
      closeModal(modalInactivity);
    });
  }

  // ------------------------------------------
  // B) POPUP POR INATIVIDADE (150 segundos)
  // ------------------------------------------
  const INACTIVITY_TIME_MS = 150 * 1000; // 150 segundos (2m30s)
  let inactivityTimer = null;
  let hasInteractedWithCheckout = false;

  // Registrar se o usuário já clicou em algum checkout para não incomodar
  document.querySelectorAll('a[href*="zuptos.com.br"], a[href*="checkout"], a[href*="kiwify"], a[href*="placeholder"]').forEach(link => {
    link.addEventListener('click', () => {
      hasInteractedWithCheckout = true;
    });
  });

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    // Se já foi exibido na sessão ou se já interagiu com checkout, não dispara novamente
    if (sessionStorage.getItem('sacra3d_inactivity_shown') === 'true' || hasInteractedWithCheckout) {
      return;
    }

    inactivityTimer = setTimeout(() => {
      const isAnyModalActive = document.querySelector('.modal-backdrop.active');
      if (!isAnyModalActive && !hasInteractedWithCheckout && modalInactivity) {
        sessionStorage.setItem('sacra3d_inactivity_shown', 'true');
        openModal(modalInactivity);
      }
    }, INACTIVITY_TIME_MS);
  }

  // Eventos de monitoramento de atividade
  const userActivityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
  userActivityEvents.forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  resetInactivityTimer();

  // ==========================================
  // 6. PRESERVAÇÃO E REPASSE DINÂMICO DE UTMS EM TEMPO DE EXECUÇÃO
  // ==========================================
  function getTrackedParams() {
    const paramsMap = {};

    // 1. Recuperar parâmetros salvos da sessão anterior
    try {
      const cached = sessionStorage.getItem('sacra3d_utm_params');
      if (cached) {
        const parsed = JSON.parse(cached);
        Object.keys(parsed).forEach(k => {
          if (parsed[k] !== undefined && parsed[k] !== null && parsed[k] !== '') {
            paramsMap[k] = parsed[k];
          }
        });
      }
    } catch (e) {
      // sessionStorage indisponível ou erro de parse
    }

    // 2. Ler parâmetros reais trazidos pelo visitante na URL da página atual
    try {
      const currentSearchParams = new URLSearchParams(window.location.search);
      currentSearchParams.forEach((val, key) => {
        if (val !== undefined && val !== null && val.trim() !== '') {
          paramsMap[key] = val.trim();
        }
      });

      // 3. Persistir parâmetros unificados na sessionStorage para não perder entre navegações
      if (Object.keys(paramsMap).length > 0) {
        sessionStorage.setItem('sacra3d_utm_params', JSON.stringify(paramsMap));
      }
    } catch (e) {
      // tratamento seguro contra erros de runtime
    }

    return paramsMap;
  }

  function appendParamsToCheckoutUrl(originalUrl, paramsMap) {
    if (!originalUrl || typeof originalUrl !== 'string') return originalUrl;
    // Aplicar apenas em links de checkout (Zuptos)
    if (!originalUrl.includes('zuptos.com.br')) return originalUrl;

    try {
      const url = new URL(originalUrl, window.location.origin);

      // Concatenar e atualizar com os parâmetros reais trazidos pelo visitante
      // Mantendo as tags base existentes caso o visitante não tenha trazido o parâmetro correspondente
      Object.keys(paramsMap).forEach(key => {
        const val = paramsMap[key];
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.set(key, val);
        }
      });

      // Retornar a URL decodificando {{...}} para manter tags base do Facebook limpas se não preenchidas
      return url.toString().replace(/%7B/gi, '{').replace(/%7D/gi, '}');
    } catch (e) {
      return originalUrl;
    }
  }

  function updateAllCheckoutLinks() {
    const trackedParams = getTrackedParams();
    const checkoutLinks = document.querySelectorAll('a[href*="zuptos.com.br"]');

    checkoutLinks.forEach(link => {
      const currentHref = link.getAttribute('href');
      if (currentHref) {
        const newHref = appendParamsToCheckoutUrl(currentHref, trackedParams);
        if (newHref && newHref !== currentHref) {
          link.setAttribute('href', newHref);
        }
      }
    });
  }

  // Executar imediatamente no carregamento da página
  updateAllCheckoutLinks();

  // Garantir atualização em tempo de execução ao clicar em qualquer ponto de conversão
  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[href*="zuptos.com.br"]');
    if (targetLink) {
      const trackedParams = getTrackedParams();
      const currentHref = targetLink.getAttribute('href');
      const updatedHref = appendParamsToCheckoutUrl(currentHref, trackedParams);
      if (updatedHref) {
        targetLink.setAttribute('href', updatedHref);
      }
    }
  }, { capture: true });

  // ==========================================
  // 8. CARROSSEL DE PRINTS DE CLIENTES (PROVA SOCIAL)
  // ==========================================
  const printsContainer = document.getElementById('prints-carousel-container');
  const printsTrack = document.getElementById('prints-carousel-track');
  const printsPrevBtn = document.getElementById('prints-prev');
  const printsNextBtn = document.getElementById('prints-next');
  const printsDotsContainer = document.getElementById('prints-dots');

  if (printsContainer && printsTrack) {
    const originalCards = Array.from(printsTrack.querySelectorAll('.prints-card'));
    const totalOriginal = originalCards.length;
    const dots = printsDotsContainer ? Array.from(printsDotsContainer.querySelectorAll('.prints-dot')) : [];

    if (totalOriginal > 0) {
      // Clones para permitir looping infinito contínuo e suave
      const clonesBefore = originalCards.map(c => c.cloneNode(true));
      const clonesAfter = originalCards.map(c => c.cloneNode(true));

      clonesBefore.forEach(clone => {
        clone.setAttribute('aria-hidden', 'true');
        printsTrack.insertBefore(clone, originalCards[0]);
      });

      clonesAfter.forEach(clone => {
        clone.setAttribute('aria-hidden', 'true');
        printsTrack.appendChild(clone);
      });

      let currentTrackIndex = totalOriginal;
      let autoplayTimer = null;
      const AUTOPLAY_MS = 3500;

      function updatePrintsCarousel(animate = true) {
        const allCards = printsTrack.querySelectorAll('.prints-card');
        if (!allCards || allCards.length === 0) return;

        if (animate) {
          printsTrack.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
          printsTrack.style.transition = 'none';
        }

        const targetCard = allCards[currentTrackIndex];
        if (!targetCard) return;

        const containerWidth = printsContainer.clientWidth;
        const cardOffset = targetCard.offsetLeft;
        const cardWidth = targetCard.offsetWidth;
        const translateX = (containerWidth / 2) - (cardOffset + cardWidth / 2);

        printsTrack.style.transform = `translateX(${translateX}px)`;

        allCards.forEach((card, idx) => {
          if (idx === currentTrackIndex) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });

        const realIndex = ((currentTrackIndex - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
        dots.forEach((dot, idx) => {
          if (idx === realIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      // Loop sem salto na finalização da animação
      printsTrack.addEventListener('transitionend', () => {
        if (currentTrackIndex >= totalOriginal * 2) {
          currentTrackIndex -= totalOriginal;
          updatePrintsCarousel(false);
        } else if (currentTrackIndex < totalOriginal) {
          currentTrackIndex += totalOriginal;
          updatePrintsCarousel(false);
        }
      });

      function startPrintsAutoplay() {
        stopPrintsAutoplay();
        autoplayTimer = setInterval(() => {
          currentTrackIndex++;
          updatePrintsCarousel(true);
        }, AUTOPLAY_MS);
      }

      function stopPrintsAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      if (printsNextBtn) {
        printsNextBtn.addEventListener('click', () => {
          stopPrintsAutoplay();
          currentTrackIndex++;
          updatePrintsCarousel(true);
          startPrintsAutoplay();
        });
      }

      if (printsPrevBtn) {
        printsPrevBtn.addEventListener('click', () => {
          stopPrintsAutoplay();
          currentTrackIndex--;
          updatePrintsCarousel(true);
          startPrintsAutoplay();
        });
      }

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
          if (!isNaN(targetIndex)) {
            stopPrintsAutoplay();
            currentTrackIndex = totalOriginal + targetIndex;
            updatePrintsCarousel(true);
            startPrintsAutoplay();
          }
        });
      });

      // Pausar rotação no hover
      printsContainer.addEventListener('mouseenter', stopPrintsAutoplay);
      printsContainer.addEventListener('mouseleave', startPrintsAutoplay);

      // Suporte a Touch Swipe no Mobile
      let dragStartX = 0;
      let dragStartY = 0;
      let dragTranslateX = 0;
      let isDragging = false;
      let isHorizontalSwipe = false;

      function getCurrentTranslateX() {
        const style = window.getComputedStyle(printsTrack);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
      }

      printsContainer.addEventListener('touchstart', (e) => {
        stopPrintsAutoplay();
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        dragTranslateX = getCurrentTranslateX();
        isDragging = true;
        isHorizontalSwipe = false;
        printsTrack.style.transition = 'none';
      }, { passive: true });

      printsContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const diffX = touch.clientX - dragStartX;
        const diffY = touch.clientY - dragStartY;

        if (!isHorizontalSwipe) {
          if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
          }
          isHorizontalSwipe = true;
        }

        printsTrack.style.transform = `translateX(${dragTranslateX + diffX}px)`;
      }, { passive: true });

      printsContainer.addEventListener('touchend', (e) => {
        if (!isDragging && !isHorizontalSwipe) {
          startPrintsAutoplay();
          return;
        }
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - dragStartX;
        isDragging = false;
        isHorizontalSwipe = false;

        if (diffX < -45) {
          currentTrackIndex++;
        } else if (diffX > 45) {
          currentTrackIndex--;
        }
        updatePrintsCarousel(true);
        setTimeout(startPrintsAutoplay, 1500);
      });

      // Arraste com Mouse no Desktop
      let mouseStartX = 0;
      let isMouseDown = false;

      printsContainer.addEventListener('mousedown', (e) => {
        stopPrintsAutoplay();
        mouseStartX = e.clientX;
        dragTranslateX = getCurrentTranslateX();
        isMouseDown = true;
        printsTrack.style.transition = 'none';
        printsContainer.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const diffX = e.clientX - mouseStartX;
        printsTrack.style.transform = `translateX(${dragTranslateX + diffX}px)`;
      });

      window.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        printsContainer.style.cursor = 'grab';
        const diffX = e.clientX - mouseStartX;
        if (diffX < -45) {
          currentTrackIndex++;
        } else if (diffX > 45) {
          currentTrackIndex--;
        }
        updatePrintsCarousel(true);
        setTimeout(startPrintsAutoplay, 1500);
      });

      window.addEventListener('resize', () => {
        updatePrintsCarousel(false);
      });

      // Iniciar após renderização
      setTimeout(() => {
        updatePrintsCarousel(false);
        startPrintsAutoplay();
      }, 100);
    }
  }
});
