const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const successMessage = contactForm.querySelector('.form-success');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const setFieldState = (field, message = '') => {
    const errorEl = contactForm.querySelector(`[data-error-for="${field.name}"]`);

    if (errorEl) {
      errorEl.textContent = message;
    }

    if (message) {
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (!value) {
      setFieldState(field, 'This field is required.');
      return false;
    }

    if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        setFieldState(field, 'Please enter a valid email address.');
        return false;
      }
    }

    setFieldState(field);
    return true;
  };

  [nameInput, emailInput, messageInput].forEach((field) => {
    if (!field) return;

    field.addEventListener('input', () => {
      validateField(field);
      if (successMessage) {
        successMessage.textContent = '';
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      if (successMessage) {
        successMessage.textContent = '';
      }
      return;
    }

    if (successMessage) {
      successMessage.textContent = 'Your message has been sent successfully.';
    }

    contactForm.reset();
    [nameInput, emailInput, messageInput].forEach((field) => {
      if (!field) return;
      field.classList.remove('invalid');
    });
    contactForm.querySelectorAll('.error-message').forEach((el) => {
      el.textContent = '';
    });
  });
}

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

if (galleryItems.length && lightbox && lightboxImage && lightboxCaption && lightboxClose) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      const title = item.dataset.title || 'Portfolio image';
      const caption = item.dataset.caption || image?.alt || 'Portfolio image';

      if (!image) return;

      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = `${title} — ${caption}`;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
