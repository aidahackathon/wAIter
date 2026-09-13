"use server";

import { GoogleGenAI } from "@google/genai";

// Инициализируем клиента. Ключ автоматически подтянется из process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export interface AnalyzeResult {
  probability: number;
  scale: "Низкий" | "Средний" | "Высокий" | "Критический";
  description: string;
  error?: string;
}

export async function analyzeIncident(formData: FormData): Promise<AnalyzeResult> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("Файл не найден");
    }

    // Конвертируем файл в Base64 для отправки в Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    const prompt = `
      Ты главный инженер-эксперт коммунальных служб города Актау.
      Твоя задача — проанализировать фотографию или стоп-кадр от жителя на предмет утечки воды из труб, луж или прорывов.
      
      Оцени ситуацию и верни ответ СТРОГО в формате JSON, используя следующую структуру (без markdown-оберток):
      {
        "probability": <число от 0 до 100, где 100 - это 100% прорыв/утечка>,
        "scale": "<одно из значений: Низкий, Средний, Высокий, Критический>",
        "description": "<краткое профессиональное обоснование твоего решения, 1-2 предложения. Пиши понятным языком.>"
      }
    `;

    // Вызываем мультимодальную модель Gemini 1.5 Flash (быстрая и дешевая, идеально для MVP)
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type, // 'image/jpeg', 'image/png' и т.д.
          },
        },
      ],
      config: {
        responseMimeType: "application/json", // Заставляем модель вернуть чистый JSON
      },
    });

    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("Пустой ответ от ИИ");
    }

    const jsonResult = JSON.parse(resultText) as AnalyzeResult;
    return jsonResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      probability: 0,
      scale: "Низкий",
      description: "Произошла ошибка при анализе. Попробуйте еще раз.",
      error: error.message,
    };
  }
}
