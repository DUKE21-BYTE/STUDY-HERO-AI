export const PROMPTS = {
  analyzeNotes: (notes) => `
You are an expert educational AI. Analyze these student notes and extract structured information.

NOTES:
<content>
${notes}
</content>

Respond in this exact JSON format:
{
  "title": "Main topic title",
  "keyConcepts": ["concept 1", "concept 2", "concept 3", ...],
  "topics": [
    {"name": "Topic Name", "summary": "Brief summary"}
  ],
  "keyTerms": [{"term": "term", "definition": "definition"}],
  "summary": "2-3 sentence overall summary"
}
`,

  generateMCQ: (content, count = 10, difficulty = "medium") => `
You are an expert exam question creator. Generate ${count} high-quality multiple choice questions from this content.

CONTENT:
<content>
${content}
</content>

DIFFICULTY: ${difficulty}

Respond in this exact JSON format:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": "A",
      "explanation": "Why this is correct"
    }
  ]
}
`,

  generateQuiz: (content, quizType = "mixed") => `
You are an expert educator. Generate 10 quiz questions from this content. 
Quiz type: ${quizType}

CONTENT:
<content>
${content}
</content>

Respond in this exact JSON format:
{
  "questions": [
    {
      "type": "short_answer|fill_blank|concept",
      "question": "Question text",
      "answer": "Expected answer",
      "hint": "Optional hint"
    }
  ]
}
`,

  generateSummary: (content, format = "bullet", length = "medium") => `
You are an expert educational summarizer. Create a ${format} summary of the following content.
Length: ${length} (short=3-5 points, medium=8-12 points, detailed=15-20 points)
Format: ${format}

CONTENT:
<content>
${content}
</content>

${format === "bullet" ? "Use bullet points with clear, concise points." : ""}
${format === "paragraph" ? "Write flowing paragraphs." : ""}
${format === "exam" ? "Focus on likely exam topics and key facts only." : ""}
${format === "revision" ? "Short, memorable key points perfect for last-minute revision." : ""}

Respond with the formatted summary directly (no JSON needed).
`,

  generateEssay: (topic, notes = "", length = 800, tone = "academic") => `
You are an expert academic writer. Write a complete ${tone} essay on the topic below.
Target length: approximately ${length} words.

TOPIC: <user_topic>${topic}</user_topic>
${notes ? `REFERENCE NOTES:\n<content>${notes}</content>` : ""}

Structure the essay with:
- INTRODUCTION: Hook, background, thesis statement
- BODY PARAGRAPH 1: First main argument with evidence
- BODY PARAGRAPH 2: Second main argument with evidence  
- BODY PARAGRAPH 3: Third main argument with evidence
- CONCLUSION: Restate thesis, summary, closing thought

Format your response as JSON:
{
  "title": "Essay title",
  "introduction": "Introduction paragraph",
  "body": [
    {"heading": "Subheading", "content": "Paragraph content"}
  ],
  "conclusion": "Conclusion paragraph",
  "wordCount": 800
}
`,

  generateExamQuestions: (content, count = 20, type = "mixed", difficulty = "medium") => `
You are a university exam setter. Generate ${count} predicted exam questions from the content below.
Question types: ${type}
Difficulty: ${difficulty}

CONTENT:
<content>
${content}
</content>

Respond in this exact JSON format:
{
  "examTitle": "Subject/Topic Exam",
  "totalMarks": ${count * 5},
  "instructions": "Answer all questions",
  "sections": [
    {
      "title": "Section A - Multiple Choice",
      "type": "mcq",
      "questions": [{"question": "...", "options": ["A)...","B)...","C)...","D)..."], "correct": "A", "marks": 2}]
    },
    {
      "title": "Section B - Short Answer",
      "type": "short",
      "questions": [{"question": "...", "marks": 5, "guidelines": "Expected answer points"}]
    }
  ]
}
`,

  solveMath: (problem) => `
You are an expert mathematics tutor. Solve this problem step by step.

PROBLEM: <math_problem>${problem}</math_problem>

Respond in this exact JSON format:
{
  "problem": "Restate the problem clearly",
  "approach": "Brief explanation of the solving method",
  "steps": [
    {"step": 1, "description": "Step description", "work": "Mathematical work shown", "result": "Result of this step"}
  ],
  "finalAnswer": "The final answer",
  "explanation": "Why this approach was used",
  "practiceQuestions": ["Similar practice problem 1", "Similar practice problem 2", "Similar practice problem 3"]
}
`,

  solveMathFromImage: () => `
You are an expert mathematics tutor. Look at this math problem in the image and solve it step by step.

Respond in this exact JSON format:
{
  "problem": "State the problem you see in the image",
  "approach": "Brief explanation of the solving method",
  "steps": [
    {"step": 1, "description": "Step description", "work": "Mathematical work shown", "result": "Result of this step"}
  ],
  "finalAnswer": "The final answer",
  "explanation": "Why this approach was used",
  "practiceQuestions": ["Similar practice problem 1", "Similar practice problem 2", "Similar practice problem 3"]
}
`,

  generateStory: (content, theme = "superhero") => `
You are a creative educational storyteller. Transform the following study content into an engaging ${theme}-themed story that teaches the concepts.

THEME: ${theme}
CONTENT:
<content>
${content}
</content>

Create an immersive story where:
- Characters represent key concepts
- Plot events illustrate the learning points
- Important terms are naturally woven in (mark them with *asterisks*)
- The story is educational AND entertaining

Respond in this exact JSON format:
{
  "title": "Story title",
  "theme": "${theme}",
  "setting": "Story setting description",
  "chapters": [
    {
      "chapterTitle": "Chapter name",
      "content": "Story paragraph with *key terms* highlighted",
      "concept": "What concept this chapter teaches"
    }
  ],
  "keyTermsGlossary": [{"term": "term", "meaning": "simple explanation"}],
  "recap": "Summary of what was learned through the story"
}
`,

  generateSlides: (content, topic = "") => `
You are an expert presentation designer. Create a complete slide deck from this content.

${topic ? `TOPIC: ${topic}` : ""}
CONTENT:
<content>
${content}
</content>

Respond in this exact JSON format:
{
  "presentationTitle": "Title",
  "theme": "Professional",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title",
      "title": "Main Title",
      "subtitle": "Subtitle or date"
    },
    {
      "slideNumber": 2,
      "type": "agenda",
      "title": "Agenda",
      "points": ["Topic 1", "Topic 2"]
    },
    {
      "slideNumber": 3,
      "type": "content",
      "title": "Slide title",
      "points": ["Key point 1", "Key point 2", "Key point 3"],
      "note": "Speaker note"
    }
  ]
}
`,

  humanizeText: (text) => `
You are an expert editor. Rewrite the following AI-generated text to sound natural, human, and engaging while preserving all the information.

ORIGINAL TEXT:
<content>
${text}
</content>

Rules:
- Vary sentence length and structure
- Use natural transitions
- Remove repetitive phrases
- Add subtle personality
- Keep academic tone but make it flow naturally
- Do NOT add new information

Respond with just the rewritten text (no JSON).
`,

  generateTopicPack: (subject, topic, level) => `
You are an expert educator. Generate a complete study pack for this topic.

SUBJECT: <subject>${subject}</subject>
TOPIC: <topic>${topic}</topic>
ACADEMIC LEVEL: ${level}

Respond in this exact JSON format:
{
  "subject": "${subject}",
  "topic": "${topic}",
  "level": "${level}",
  "overview": "2-3 sentence topic overview",
  "notes": {
    "sections": [
      {"heading": "Section title", "content": "Detailed notes content", "keyPoints": ["point1", "point2"]}
    ]
  },
  "summary": ["Bullet point 1", "Bullet point 2"],
  "keyConcepts": [{"concept": "name", "definition": "definition", "example": "example"}],
  "mcqs": [
    {"question": "MCQ?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "why"}
  ],
  "examQuestions": [
    {"type": "short", "question": "Question?", "marks": 5, "answer": "Model answer"}
  ]
}
`,
};
