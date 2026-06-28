document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => revealObserver.observe(element));

  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      menuItems.forEach((item) => {
        const isVisible = filter === 'all' || item.dataset.category === filter;
        item.style.display = isVisible ? 'block' : 'none';
      });
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const successMessage = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const errors = {
        name: document.querySelector('[data-error-for="name"]'),
        email: document.querySelector('[data-error-for="email"]'),
        message: document.querySelector('[data-error-for="message"]')
      };

      let valid = true;
      [errors.name, errors.email, errors.message].forEach((element) => {
        element.textContent = '';
      });

      if (!name.value.trim()) {
        errors.name.textContent = 'Informe seu nome.';
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        errors.email.textContent = 'Informe seu e-mail.';
        valid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        errors.email.textContent = 'Digite um e-mail válido.';
        valid = false;
      }

      if (!message.value.trim()) {
        errors.message.textContent = 'Escreva uma mensagem.';
        valid = false;
      }

      if (valid) {
        successMessage.textContent = 'Mensagem enviada com sucesso. Em breve entraremos em contato.';
        contactForm.reset();
      } else {
        successMessage.textContent = '';
      }
    });
  }
});
