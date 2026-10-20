
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false
  })
);

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'ICEMAN CODE LEARN'
  });
});

// Gemini AI chat
app.post('/api/ai/chat', async (req, res) => {
  const message =
    typeof req.body?.message === 'string'
      ? req.body.message.trim()
      : '';

  if (!message) {
    return res.status(400).json({
      error: 'Please provide a message.'
    });
  }

  if (message.length > 8000) {
    return res.status(413).json({
      error: 'Message is too long.'
    });
  }

  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(503).json({
      error: 'AI is not configured. Add GEMINI_API_KEY to the server environment.'
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response;

    try {
      response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: message }]
              }
            ]
          }),
          signal: controller.signal
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Gemini API status:', response.status);

      return res.status(502).json({
        error:
          response.status === 429
            ? 'The AI service is busy or its quota has been reached. Please try again later.'
            : response.status === 401 || response.status === 403
              ? 'The Gemini API key is invalid or does not have permission.'
              : data?.error?.message || 'Gemini request failed.'
      });
    }

    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || '')
      .join('\n')
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: 'Gemini did not return a text response. Please try again.'
      });
    }

    return res.json({ reply });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'The AI request timed out. Please try again.'
      });
    }

    console.error('AI request failed:', error.message);

    return res.status(502).json({
      error: 'Could not reach the AI provider. Check the server connection and try again.'
    });
  }
});

// Website fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'), err => {
    if (err && !res.headersSent) {
      res.status(404).send('Website page not found. Check public/index.html.');
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ICEMAN CODE LEARN running on port ${PORT}`);
});
