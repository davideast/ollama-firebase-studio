export class OllamaClient {
  OLLAMA_BASE_URL: string;

  constructor({ port }: { port: number }) {
    this.OLLAMA_BASE_URL = `http://localhost:${port}`;
  }

  async listModels() {
    const res = await fetch(`${this.OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch models from Ollama API: ${errorText}`);
    }
    const data = await res.json();
    return data.models;
  }

  async generateStream({ model, prompt }: { model: string; prompt: string }) {
    const ollamaRes = await fetch(`${this.OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: true }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      const errorText = await ollamaRes.text();
      throw new Error(`Ollama API Error: ${errorText}`);
    }

    return ollamaRes.body.pipeThrough(this.createStreamParser());
  }

  createStreamParser() {
    return new TransformStream({
      transform(chunk, controller) {
        try {
          const lines = new TextDecoder().decode(chunk).split('\n');
          for (const line of lines) {
            if (line.trim()) {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                controller.enqueue(parsed.response);
              }
              if (parsed.done) {
                controller.terminate();
              }
            }
          }
        } catch (error) {
          console.error('Error parsing Ollama stream chunk:', error);
          controller.enqueue(`\n[ERROR: Failed to parse stream data]\n`);
          controller.terminate();
        }
      },
    });
  }
}
