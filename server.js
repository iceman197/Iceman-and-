require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'ICEMAN CODE LEARN' }));

app.post('/api/ai/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please provide a message.' });
  if (message.length > 8000) return res.status(413).json({ error: 'Message is too long.' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI is not configured. Add GEMINI_API_KEY to server environment.' });
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: data?.error?.message || 'Gemini request failed.' });
    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\\n').trim();
    return res.json({ reply: reply || 'Gemini returned an empty response.' });
  } catch (error) {
    console.error('AI request failed:', error.message);
    return res.status(502).json({ error: 'Could not reach the AI provider.' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`ICEMAN CODE LEARN running on port ${PORT}`));
