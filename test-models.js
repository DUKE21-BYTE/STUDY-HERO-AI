const fs = require('fs');
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAdQwCyH_6c_X4SEy4WzZhzS29Ei87N6gE";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function getModels() {
  const res = await fetch(url);
  const data = await res.json();
  fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
}

getModels();
