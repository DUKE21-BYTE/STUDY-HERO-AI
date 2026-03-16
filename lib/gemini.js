import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  if (imageBase64) {
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
      prompt,
    ]);
    return result.response.text();
  }

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
