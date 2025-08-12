# Ollama in Firebase Studio

This project provides a simple web server built with [Hono](https://hono.dev/) and [Bun](https://bun.sh/) that streams responses from an [Ollama](https://ollama.com/) model.

**Open in Firebase Studio and that's it.**

<a href="https://studio.firebase.google.com/import?url=https%3A%2F%2Fgithub.com%2Fdavideast%2Follama-firebase-studio">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://cdn.firebasestudio.dev/btn/open_dark_32.svg">
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://cdn.firebasestudio.dev/btn/open_light_32.svg">
    <img
      height="32"
      alt="Open in Firebase Studio"
      src="https://cdn.firebasestudio.dev/btn/open_blue_32.svg">
  </picture>
</a>

## Run Ollama

```bash
ollama run gemma3:1b "$(printf 'Analyze this package.json and optimize it:\n\n%s\n' "$(cat package.json)")"
```

## API Endpoints

The server exposes the following endpoints:

### List Models

- **URL:** `/list`
- **Method:** `GET`
- **Description:** Retrieves a list of all available models from the Ollama server.
- **Example:**
  ```bash
  curl http://localhost:9002/list
  ```

### Generate a Streamed Response

- **URL:** `/:model?`
- **Method:** `GET`
- **Description:** Generates a streamed response from a specified Ollama model based on a prompt.
- **URL Parameters:**
  - `model` (optional): The name of the model to use. Defaults to `gemma3:4b`.
- **Query Parameters:**
  - `prompt` (required): The prompt to send to the model.
- **Examples:**

  **Using default model and prompt:**
  ```bash
  curl http://localhost:9002/
  ```

  **Specifying a prompt:**
  ```bash
  curl "http://localhost:9002/?prompt=Why is the sky blue?"
  ```

  **Specifying a model and a prompt:**
  ```bash
  curl "http://localhost:9002/llama3?prompt=Write a short story about a robot."
  ```
