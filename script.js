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

const projectDetails = [...document.querySelectorAll('.project-detail')];
const projectLinks = [...document.querySelectorAll('[data-project-link]')];

const showProjectDetail = () => {
  if (!projectDetails.length) {
    return;
  }

  const fallbackId = projectDetails[0].id;
  const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
  const selectedDetail = document.getElementById(hashId) || document.getElementById(fallbackId);

  projectDetails.forEach((detail) => {
    detail.hidden = detail !== selectedDetail;
  });

  projectLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${selectedDetail.id}`);
  });

  const title = selectedDetail.querySelector('h2')?.textContent.trim();
  if (title) {
    document.title = `${title} - Thomas Lepere`;
  }
};

showProjectDetail();
window.addEventListener('hashchange', showProjectDetail);

const lightbox = document.querySelector('.lightbox');

if (lightbox) {
  const lightImg = lightbox.querySelector('img');
  const closeLightbox = () => {
    lightbox.hidden = true;
  };

  document.querySelectorAll('.gallery-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      lightImg.src = btn.dataset.full;
      lightbox.hidden = false;
    });
  });

  lightbox.querySelector('button').addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
}