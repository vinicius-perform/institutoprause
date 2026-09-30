// Interatividade da Landing Page MELA — Dr. Tiago Prause

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initCaseTabs();
  initAssessmentModal();
  initStickyMobileBar();
  initSmoothScroll();
});

// 1. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha todos os outros itens para manter layout limpo
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Alterna o atual
      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });

  // Deixa a primeira pergunta aberta por padrão para guiar o usuário
  if (faqItems.length > 0) {
    faqItems[0].classList.add('open');
  }
}

// 2. Tabs de Casos Clínicos (Antes e Depois)
function initCaseTabs() {
  const tabButtons = document.querySelectorAll('.case-tab-btn');
  const caseDisplays = document.querySelectorAll('.case-display-item');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCase = btn.getAttribute('data-case');

      // Atualiza botões
      tabButtons.forEach((b) => {
        b.classList.remove('active', 'bg-sky-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });

      btn.classList.add('active', 'bg-sky-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      // Atualiza exibições
      caseDisplays.forEach((display) => {
        if (display.id === targetCase) {
          display.classList.remove('hidden');
          display.classList.add('block');
        } else {
          display.classList.add('hidden');
          display.classList.remove('block');
        }
      });
    });
  });
}

// 3. Modal de Agendamento Inteligente e Pré-Avaliação
function initAssessmentModal() {
  const modal = document.getElementById('assessment-modal');
  const openButtons = document.querySelectorAll('.open-modal-cta');
  const closeButton = document.getElementById('close-modal-btn');
  const modalForm = document.getElementById('assessment-form');
  const phoneInput = document.getElementById('patient-phone');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Fecha clicando no backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Máscara de telefone/WhatsApp
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
      e.target.value = value;
    });
  }

  // Envio do formulário com redirecionamento estruturado para WhatsApp
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('patient-name')?.value.trim() || 'Paciente';
      const phone = document.getElementById('patient-phone')?.value.trim() || '';
      const area = document.getElementById('treatment-area')?.value || 'Área a avaliar';
      const notes = document.getElementById('patient-notes')?.value.trim() || '';

      const baseText = `Olá, Dr. Tiago Prause e equipe! Gostaria de agendar uma avaliação individual sobre o MELA.\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Região de Incômodo:* ${area}${notes ? `\n*Observações:* ${notes}` : ''}\n\nVi a página e desejo entender as possibilidades para o meu caso.`;

      // Número WhatsApp oficial da clínica (substituível)
      const clinicNumber = "5549999999999"; 
      const whatsappUrl = `https://wa.me/${clinicNumber}?text=${encodeURIComponent(baseText)}`;

      // Redireciona e fecha modal
      window.open(whatsappUrl, '_blank');
      closeModal();
    });
  }
}

// 4. Barra Fixa Mobile (Sticky CTA)
function initStickyMobileBar() {
  const stickyBar = document.getElementById('sticky-mobile-bar');
  if (!stickyBar) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Mostra após rolar 400px e esconde perto do footer
    const footer = document.querySelector('footer');
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    const isNearFooter = footerRect ? footerRect.top < window.innerHeight : false;

    if (currentScrollY > 400 && !isNearFooter && window.innerWidth < 768) {
      stickyBar.classList.add('active');
    } else {
      stickyBar.classList.remove('active');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// 5. Scroll suave para âncoras
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

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
