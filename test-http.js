const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAdQwCyH_6c_X4SEy4WzZhzS29Ei87N6gE";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

async function test() {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
