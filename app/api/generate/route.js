import { generateContent } from "@/lib/gemini";
import { PROMPTS } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { type, content, config = {}, imageBase64, mimeType } = await request.json();

    let prompt;
    let result;

    switch (type) {
      case "analyzeNotes":
        prompt = PROMPTS.analyzeNotes(content);
        break;
      case "generateMCQ":
        prompt = PROMPTS.generateMCQ(content, config.count || 10, config.difficulty || "medium");
        break;
      case "generateQuiz":
        prompt = PROMPTS.generateQuiz(content, config.quizType || "mixed");
        break;
      case "generateSummary":
        prompt = PROMPTS.generateSummary(content, config.format || "bullet", config.length || "medium");
        break;
      case "generateEssay":
        prompt = PROMPTS.generateEssay(content, config.notes || "", config.length || 800, config.tone || "academic");
        break;
      case "generateExamQuestions":
        prompt = PROMPTS.generateExamQuestions(content, config.count || 20, config.type || "mixed", config.difficulty || "medium");
        break;
      case "solveMath":
        if (imageBase64) {
          prompt = PROMPTS.solveMathFromImage();
          result = await generateContent(prompt, imageBase64, mimeType || "image/jpeg");
        } else {
          prompt = PROMPTS.solveMath(content);
        }
        break;
      case "generateStory":
        prompt = PROMPTS.generateStory(content, config.theme || "superhero");
        break;
      case "generateSlides":
        prompt = PROMPTS.generateSlides(content, config.topic || "");
        break;
      case "humanizeText":
        prompt = PROMPTS.humanizeText(content);
        result = await generateContent(prompt);
        return NextResponse.json({ result });
      case "generateTopicPack":
        prompt = PROMPTS.generateTopicPack(config.subject, content, config.level || "undergraduate");
        break;
      default:
        return NextResponse.json({ error: "Unknown generation type" }, { status: 400 });
    }

    if (!result) {
      result = await generateContent(prompt, imageBase64 || null, mimeType);
    }

    // Try to parse JSON from response
    const jsonMatch = result.match(/```json\n?([\s\S]*?)\n?```/) || result.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return NextResponse.json({ result: parsed });
      } catch {
        return NextResponse.json({ result });
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
