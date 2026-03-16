// localStorage helpers for analytics tracking

const STORAGE_KEYS = {
  QUIZ_SCORES: "sh_quiz_scores",
  STREAK: "sh_streak",
  LAST_STUDY: "sh_last_study",
  TOPICS_STUDIED: "sh_topics_studied",
  TOTAL_QUESTIONS: "sh_total_questions",
  CORRECT_ANSWERS: "sh_correct_answers",
};

export function recordQuizScore(topic, score, total) {
  if (typeof window === "undefined") return;
  const scores = getQuizScores();
  scores.push({ topic, score, total, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores.slice(-50)));
  updateStreak();
  
  const totalQ = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_QUESTIONS) || "0");
  const correct = parseInt(localStorage.getItem(STORAGE_KEYS.CORRECT_ANSWERS) || "0");
  localStorage.setItem(STORAGE_KEYS.TOTAL_QUESTIONS, totalQ + total);
  localStorage.setItem(STORAGE_KEYS.CORRECT_ANSWERS, correct + score);
}

export function getQuizScores() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES) || "[]");
  } catch { return []; }
}

export function getStreak() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || "0");
}

export function updateStreak() {
  if (typeof window === "undefined") return;
  const last = localStorage.getItem(STORAGE_KEYS.LAST_STUDY);
  const today = new Date().toDateString();
  if (!last) {
    localStorage.setItem(STORAGE_KEYS.STREAK, "1");
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === today) {
      // same day, no change
    } else if (last === yesterday.toDateString()) {
      const streak = getStreak();
      localStorage.setItem(STORAGE_KEYS.STREAK, streak + 1);
    } else {
      localStorage.setItem(STORAGE_KEYS.STREAK, "1");
    }
  }
  localStorage.setItem(STORAGE_KEYS.LAST_STUDY, today);
}

export function recordTopicStudied(topic, subject) {
  if (typeof window === "undefined") return;
  const topics = getTopicsStudied();
  const existing = topics.find((t) => t.topic === topic);
  if (existing) {
    existing.count++;
    existing.lastStudied = new Date().toISOString();
  } else {
    topics.push({ topic, subject, count: 1, lastStudied: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEYS.TOPICS_STUDIED, JSON.stringify(topics.slice(-30)));
  updateStreak();
}

export function getTopicsStudied() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPICS_STUDIED) || "[]");
  } catch { return []; }
}

export function getAccuracy() {
  if (typeof window === "undefined") return 0;
  const total = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_QUESTIONS) || "0");
  const correct = parseInt(localStorage.getItem(STORAGE_KEYS.CORRECT_ANSWERS) || "0");
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getWeakTopics() {
  const scores = getQuizScores();
  const topicScores = {};
  scores.forEach(({ topic, score, total }) => {
    if (!topicScores[topic]) topicScores[topic] = { score: 0, total: 0 };
    topicScores[topic].score += score;
    topicScores[topic].total += total;
  });
  return Object.entries(topicScores)
    .map(([topic, { score, total }]) => ({
      topic,
      accuracy: Math.round((score / total) * 100),
    }))
    .filter((t) => t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getStats() {
  return {
    streak: getStreak(),
    accuracy: getAccuracy(),
    totalTopics: getTopicsStudied().length,
    recentScores: getQuizScores().slice(-7),
    weakTopics: getWeakTopics(),
  };
}
