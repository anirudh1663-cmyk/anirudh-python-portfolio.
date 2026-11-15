import express from 'express';

export function createApp(saveMessage) {
  const app = express();
  app.disable('x-powered-by');
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/contact', async (req, res) => {
    const origin = req.get('origin');
    if (origin) {
      let originHost;
      try { originHost = new URL(origin).host; } catch { return res.status(403).json({ error: 'Invalid request origin.' }); }
      if (originHost !== req.get('host')) return res.status(403).json({ error: 'Invalid request origin.' });
    }
    if (!req.is('application/json')) return res.status(415).json({ error: 'Please send JSON.' });
    const body = req.body ?? {};
    if (typeof body.website === 'string' && body.website) return res.status(201).json({ message: 'Thanks for reaching out.' });
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!name || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 5000) {
      return res.status(400).json({ error: 'Enter your name, a valid email, and a message between 10 and 5,000 characters.' });
    }
    try {
      await saveMessage({ name, email, message });
      return res.status(201).json({ message: 'Thanks! Your message has been saved. I look forward to connecting.' });
    } catch {
      return res.status(503).json({ error: 'Your message could not be saved right now. Please try again shortly.' });
    }
  });
  app.all('/api/contact', (_req, res) => res.set('Allow', 'POST').status(405).json({ error: 'Method not allowed.' }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
  app.use((err, _req, res, _next) => {
    const status = err.type === 'entity.too.large' ? 413 : 400;
    res.status(status).json({ error: status === 413 ? 'Message is too large.' : 'Invalid request body.' });
  });
  return app;
}
