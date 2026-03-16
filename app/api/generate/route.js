import { generateContent } from "@/lib/gemini";
import { PROMPTS } from "@/lib/prompts";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on server restart/cold start)
// This is sufficient for MVP protection against basic script abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute

// Keep map size in check by deleting expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request) {
  try {
    // 1. Basic Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      const limitData = rateLimitMap.get(ip);
      if (now > limitData.resetTime) {
        limitData.count = 1;
        limitData.resetTime = now + RATE_LIMIT_WINDOW_MS;
      } else {
        limitData.count++;
        if (limitData.count > MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please wait a minute before requesting again." }, 
            { status: 429, headers: { "Retry-After": "60" } }
          );
        }
      }
    }

    // 2. Payload size explicit check (backup to next.config.api.bodyParser)
    const bodyText = await request.text();
    if (bodyText.length > 4.5 * 1024 * 1024) { // 4.5MB limit
      return NextResponse.json({ error: "Payload too large. Maximum size is 4MB." }, { status: 413 });
    }

    const { type, content, config = {}, imageBase64, mimeType } = JSON.parse(bodyText);

    // 3. Content length sanity check (Prompt injection/exhaustion mitigation)
    if (content && content.length > 25000) {
      return NextResponse.json({ error: "Input content exceeds the 25,000 character limit." }, { status: 400 });
    }

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
