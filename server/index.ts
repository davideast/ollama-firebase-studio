import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { OllamaClient } from './ollama';

const DEFAULT_MODEL = 'gemma3:1b';

const app = new Hono();
const ollama = new OllamaClient({ port: 11434 });

app.onError((err, c) => {
  console.error('An error occurred:', err);
  return c.json({ error: 'An internal server error occurred', details: err.message }, 500);
});

app.get('/list', async (c) => {
  const models = await ollama.listModels();
  return c.json(models);
});

app.get('/:model?', (c) => {
  const model = c.req.param('model') || DEFAULT_MODEL;
  const prompt = c.req.query('prompt') || 'How does Ollama work?';

  if (!prompt) {
    return c.json({ error: 'The "prompt" query parameter is required.' }, 400);
  }

  return stream(c, async (stream) => {
    const ollamaStream = await ollama.generateStream({ model, prompt });
    await stream.pipe(ollamaStream);
  });
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
