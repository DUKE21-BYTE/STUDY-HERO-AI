import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAdQwCyH_6c_X4SEy4WzZhzS29Ei87N6gE");

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello?");
    console.log("Success:", await result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
