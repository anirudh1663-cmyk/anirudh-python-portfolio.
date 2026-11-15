if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const form = document.querySelector('.contact-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button');
  const status = form.querySelector('.form-status');
  button.disabled = true;
  button.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = 'Saving your message…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send your message. Please try again.');
    status.classList.add('success');
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.classList.add('error');
    status.textContent = error.name === 'TimeoutError' || error instanceof TypeError
      ? 'Connection interrupted. Please try again when you are online.'
      : error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'Send message ↗';
  }
});
