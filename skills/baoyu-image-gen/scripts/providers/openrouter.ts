import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { CliArgs } from "../types";

const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview";

// Resolve skill root directory reliably across bun/node
// This file is at <skill-root>/scripts/providers/openrouter.ts
const __currentDir = typeof import.meta.dir === "string"
  ? import.meta.dir
  : path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__currentDir, '..', '..');

export function getDefaultModel(): string {
  return process.env.OPENROUTER_IMAGE_MODEL || DEFAULT_MODEL;
}

function loadSettingsApiKey(): string | null {
  const settingsPath = path.join(SKILL_ROOT, 'settings.json');
  try {
    const content = readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(content);
    return settings.openrouterApiKey || null;
  } catch {
    return null;
  }
}

function getApiKey(): string {
  const settingsKey = loadSettingsApiKey();
  if (settingsKey) return settingsKey;

  const envKey = process.env.OPENROUTER_API_KEY;
  if (envKey) return envKey;

  throw new Error(
    "OpenRouter API key is required. Configure it in skill settings or set OPENROUTER_API_KEY environment variable."
  );
}

function getBaseUrl(): string {
  const base = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  return base.replace(/\/+$/g, "");
}

type ChatCompletionImage = {
  type: string;
  image_url: string | { url: string };
};

type ChatCompletionResponse = {
  choices: Array<{
    message: {
      content?: string;
      images?: ChatCompletionImage[];
    };
  }>;
};

export async function generateImage(
  prompt: string,
  model: string,
  args: CliArgs
): Promise<Uint8Array> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  let fullPrompt = prompt;
  if (args.aspectRatio) {
    fullPrompt += ` Aspect ratio: ${args.aspectRatio}.`;
  }

  console.log(`Generating image with OpenRouter (${model})...`);

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: fullPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as ChatCompletionResponse;

  const images = data.choices?.[0]?.message?.images;
  if (!images || images.length === 0) {
    throw new Error("OpenRouter response did not contain any images");
  }

  const imageUrlRaw = images[0]!.image_url;
  // image_url can be a string or { url: string } depending on OpenRouter model
  const imageUrl = typeof imageUrlRaw === "string" ? imageUrlRaw : imageUrlRaw.url;
  // image_url format: "data:image/png;base64,iVBOR..."
  const base64Match = imageUrl.match(/^data:[^;]+;base64,(.+)$/);
  if (!base64Match) {
    throw new Error(`Unexpected image_url format from OpenRouter: ${imageUrl.slice(0, 100)}...`);
  }

  console.log("Generation completed.");

  const base64Data = base64Match[1]!;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
