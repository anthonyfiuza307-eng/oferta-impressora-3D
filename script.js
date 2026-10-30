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
});
