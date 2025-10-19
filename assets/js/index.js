document.addEventListener('click', function(e) {
    const btn = e.target.closest('.solution-cta');
    if (!btn) return;
    const card = btn.closest('.solution-card');
    const open = !card.classList.contains('is-open');
    card.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  });




document.addEventListener('DOMContentLoaded', function () {
  const row  = document.querySelector('.price-row');
  const dots = Array.from(document.querySelectorAll('.price-pager .price-dot'));
  if (!row || dots.length !== 3) return;

  // Slides = the direct children used as "cards"
  const slides = Array.from(row.children).filter(el =>
    el.matches('[class*="col-"], .price-col')
  );

  // Compute slide centers relative to the scroll container
  function centers() {
    return slides.map(s => s.offsetLeft + s.offsetWidth / 2);
  }

  function closestIndex() {
    const cs = centers();
    const viewportCenter = row.scrollLeft + row.clientWidth / 2;
    let best = 0, bestDist = Math.abs(cs[0] - viewportCenter);
    for (let i = 1; i < cs.length; i++) {
      const d = Math.abs(cs[i] - viewportCenter);
      if (d < bestDist) { best = i; bestDist = d; }
    }
    return Math.min(dots.length - 1, best);
  }

  function updateDots() {
    const idx = closestIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  // Click a dot -> scroll to the exact slide start (accounts for gaps)
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const target = slides[i];
      if (target) row.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    });
  });

  // Sync on scroll + on resize + after images/fonts load
  let ticking = false;
  row.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateDots(); ticking = false; });
      ticking = true;
    }
  });
  window.addEventListener('resize', updateDots);
  window.addEventListener('load', updateDots);

  // Initial state
  updateDots();
});
