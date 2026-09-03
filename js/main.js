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

const albumCards = document.querySelectorAll('.album-card');
const albumViewer = document.querySelector('.album-viewer');
const viewerImage = document.querySelector('.viewer-image');
const viewerCaption = document.querySelector('.viewer-caption');
const viewerCounter = document.querySelector('.viewer-counter');
const viewerClose = document.querySelector('.viewer-close');
const viewerPrev = document.querySelector('.viewer-prev');
const viewerNext = document.querySelector('.viewer-next');

if (albumCards.length && albumViewer && viewerImage && viewerCaption && viewerCounter && viewerClose && viewerPrev && viewerNext) {
  let activePhotos = [];
  let activeIndex = 0;
  let activeCard = null;

  const showPhoto = (index) => {
    const photo = activePhotos[index];
    if (!photo) return;

    activeIndex = index;
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt;
    viewerCaption.textContent = photo.caption;
    viewerCounter.textContent = `${index + 1} / ${activePhotos.length}`;
  };

  const openAlbum = (card) => {
    const photos = Array.from(card.querySelectorAll('.album-photos img')).map((img) => ({
      src: img.src,
      alt: img.alt,
      caption: img.closest('li')?.dataset.caption || img.alt,
    }));

    if (!photos.length) return;

    activePhotos = photos;
    activeCard = card;
    showPhoto(0);
    albumViewer.classList.add('is-open');
    albumViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    viewerClose.focus();
  };

  const closeAlbum = () => {
    albumViewer.classList.remove('is-open');
    albumViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeCard?.focus();
    activeCard = null;
  };

  const showNext = () => showPhoto((activeIndex + 1) % activePhotos.length);
  const showPrev = () => showPhoto((activeIndex - 1 + activePhotos.length) % activePhotos.length);

  albumCards.forEach((card) => {
    card.addEventListener('click', () => openAlbum(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openAlbum(card);
      }
    });
  });

  viewerClose.addEventListener('click', closeAlbum);
  viewerNext.addEventListener('click', showNext);
  viewerPrev.addEventListener('click', showPrev);

  albumViewer.addEventListener('click', (event) => {
    if (event.target === albumViewer) {
      closeAlbum();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!albumViewer.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeAlbum();
    } else if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });
}
