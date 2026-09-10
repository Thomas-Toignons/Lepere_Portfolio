const overlay = document.querySelector('.detail-overlay');
const details = [...document.querySelectorAll('.project-detail')];
const projectCards = [...document.querySelectorAll('.project-card')];
const toolsChart = document.querySelector('.tools-chart');
const toolsChartCount = document.querySelector('.tools-chart-count');
const toolsChartBars = document.querySelector('.tools-chart-bars');

document.querySelectorAll('.card-open[data-project]').forEach((btn) => {
  btn.addEventListener('click', () => {
    details.forEach((detail) => {
      detail.hidden = true;
    });

    const selectedDetail = document.getElementById(btn.dataset.project);
    if (!selectedDetail) {
      return;
    }

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
const projectState = {
  category: 'all',
  tool: null,
};

const getCategoryProjectCards = (filter = projectState.category) =>
  projectCards.filter((card) => {
    const category = (card.dataset.category || '').toLowerCase();
    return filter === 'all' || category.includes(filter);
  });

const getCardTools = (card) => {
  const tools = card.querySelector('.tools')?.textContent || '';

  return tools
    .split(/\s*(?:\u00b7|\u00c2\u00b7|\u2022)\s*/)
    .map((tool) => tool.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

const getFilteredProjectCards = () => {
  const categoryCards = getCategoryProjectCards();

  if (!projectState.tool) {
    return categoryCards;
  }

  return categoryCards.filter((card) =>
    getCardTools(card).includes(projectState.tool)
  );
};

const formatProjectCount = (count) =>
  `${count} ${count === 1 ? 'project' : 'projects'}`;

const renderToolsChart = () => {
  if (!toolsChart || !toolsChartBars) {
    return;
  }

  const counts = new Map();
  const categoryCards = getCategoryProjectCards();

  categoryCards.forEach((card) => {
    getCardTools(card).forEach((tool) => {
      counts.set(tool, (counts.get(tool) || 0) + 1);
    });
  });

  if (projectState.tool && !counts.has(projectState.tool)) {
    projectState.tool = null;
  }

  const sortedTools = [...counts.entries()].sort(
    ([toolA, countA], [toolB, countB]) =>
      countB - countA || toolA.localeCompare(toolB)
  );

  toolsChartBars.replaceChildren();

  if (!sortedTools.length) {
    toolsChart.hidden = true;
    return;
  }

  toolsChart.hidden = false;

  if (toolsChartCount) {
    toolsChartCount.textContent = formatProjectCount(
      getFilteredProjectCards().length
    );
  }

  toolsChart.setAttribute(
    'aria-label',
    `Tool occurrences among ${
      projectState.category === 'all' ? 'all' : projectState.category
    } projects`
  );

  const maxOccurrences = sortedTools[0][1];

  sortedTools.forEach(([tool, count]) => {
    const bar = document.createElement('button');
    const label = document.createElement('span');
    const track = document.createElement('span');
    const fill = document.createElement('span');
    const value = document.createElement('span');
    const width = Math.max((count / maxOccurrences) * 100, 8);

    bar.type = 'button';
    bar.className = 'tool-bar';
    bar.dataset.tool = tool;
    bar.title = `${tool}: ${formatProjectCount(count)}`;
    bar.style.setProperty('--bar-width', `${width}%`);
    bar.setAttribute(
      'aria-label',
      `${tool}: ${formatProjectCount(count)}`
    );
    bar.setAttribute('aria-pressed', String(projectState.tool === tool));

    label.className = 'tool-bar-label';
    label.textContent = tool;
    track.className = 'tool-bar-track';
    fill.className = 'tool-bar-fill';
    value.className = 'tool-bar-value';
    value.textContent = count;

    track.append(fill);
    bar.append(label, track, value);
    toolsChartBars.append(bar);
  });
};

const applyProjectFilter = () => {
  const filteredCards = new Set(getFilteredProjectCards());

  projectCards.forEach((card) => {
    card.hidden = !filteredCards.has(card);
  });

  renderToolsChart();
};

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((button) => {
      button.classList.remove('active');
    });

    btn.classList.add('active');
    projectState.category = btn.dataset.filter || 'all';
    projectState.tool = null;
    applyProjectFilter();
  });
});

toolsChartBars?.addEventListener('click', (event) => {
  const selectedToolButton = event.target.closest?.('.tool-bar');

  if (!selectedToolButton) {
    return;
  }

  const selectedTool = selectedToolButton.dataset.tool;
  projectState.tool = projectState.tool === selectedTool ? null : selectedTool;
  applyProjectFilter();
});

applyProjectFilter();

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
