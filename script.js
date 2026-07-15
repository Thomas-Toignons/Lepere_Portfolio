const overlay = document.querySelector('.detail-overlay');
const details = [...document.querySelectorAll('.project-detail')];

document.querySelectorAll('.card-open').forEach((btn) => {
  btn.addEventListener('click', () => {
    details.forEach((detail) => {
      detail.hidden = true;
    });

    const selectedDetail = document.getElementById(btn.dataset.project);
    selectedDetail.hidden = false;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlay.scrollTop = 0;
  });
});

document.querySelectorAll('.detail-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    overlay.hidden = true;
    document.body.style.overflow = '';
  });
});

overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
});

const filterButtons = [...document.querySelectorAll('.filters button')];

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((button) => {
      button.classList.remove('active');
    });

    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach((card) => {
      card.hidden = filter !== 'all' && !card.dataset.category.includes(filter);
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    lightImg.src = btn.dataset.full;
    lightbox.hidden = false;
  });
});

lightbox.querySelector('button').addEventListener('click', () => {
  lightbox.hidden = true;
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.hidden = true;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    lightbox.hidden = true;
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
});
