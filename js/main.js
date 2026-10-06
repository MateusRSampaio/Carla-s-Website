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

  const viewerContent = document.querySelector('.viewer-content');
  const swipeThreshold = 40;
  let touchStartX = null;

  viewerContent?.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  });

  viewerContent?.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX < 0) {
      showNext();
    } else {
      showPrev();
    }
  });
}
