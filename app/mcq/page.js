'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { recordQuizScore, recordTopicStudied } from '@/lib/analytics';

export default function MCQGenerator() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [config, setConfig] = useState({ count: 10, difficulty: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  
  // Quiz taking state
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateMCQs = async () => {
    if (!input.trim()) {
      toast.error('Please enter a topic or paste notes.');
      return;
    }

    setLoading(true);
    setQuizData(null);
    setAnswers({});
    setSubmitted(false);
    
    const loadingToast = toast.loading('Generating MCQs... 🎯');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateMCQ', 
          content: input,
          config 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setQuizData(data.result);
      if (input.length < 50) recordTopicStudied(input, 'MCQ Generation');
      toast.success('MCQs generated!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to generate MCQs: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, optionString) => {
    if (submitted) return;
    const optionLetter = optionString.charAt(0); // gets "A", "B", etc.
    setAnswers(prev => ({ ...prev, [qIndex]: optionLetter }));
  };

  const submitQuiz = () => {
    if (!quizData) return;
    let correctCount = 0;
    quizData.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
    
    // Save to analytics
    const topic = input.length < 50 ? input : 'Custom Notes';
    recordQuizScore(topic, correctCount, quizData.questions.length);
    
    const pct = (correctCount / quizData.questions.length) * 100;
    if (pct >= 80) toast.success(`Amazing! You scored ${pct}% 🏆`);
    else toast.success(`You scored ${pct}%. Keep practicing!`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>MCQ Generator 🎯</h1>
        <p>Turn notes or topics into interactive multiple choice question quizzes instantly.</p>
      </div>

      {!quizData && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">What should we test you on?</label>
            <textarea 
              className="textarea" 
              placeholder="Enter a topic (e.g. 'Photosynthesis', 'World War 2') OR paste your notes here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: '150px' }}
            />
          </div>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="input-label">Number of Questions</label>
              <select 
                className="select" 
                value={config.count} 
                onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
              >
                <option value={5}>5 Questions (Quick Test)</option>
                <option value={10}>10 Questions (Standard Quiz)</option>
                <option value={20}>20 Questions (Deep Dive)</option>
                <option value={30}>30 Questions (Exam Prep)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Difficulty</label>
              <select 
                className="select"
                value={config.difficulty}
                onChange={(e) => setConfig({...config, difficulty: e.target.value})}
              >
                <option value="Easy">Easy (Concepts)</option>
                <option value="Medium">Medium (Application)</option>
                <option value="Hard">Hard (Analysis)</option>
              </select>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateMCQs}
            disabled={loading || !input.trim()}
          >
            {loading ? <span className="spinner"></span> : 'Generate MCQs ✨'}
          </button>
        </div>
      )}

      {quizData && (
        <div className="quiz-container" style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Knowledge Check</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setQuizData(null)}>← New Quiz</button>
          </div>

          {submitted && (
            <div className={`card ${score / quizData.questions.length >= 0.8 ? 'card-gold' : ''}`} style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{score} / {quizData.questions.length}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                You scored {Math.round((score / quizData.questions.length) * 100)}% on this knowledge check.
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '2rem' }}>
            {quizData.questions.map((q, i) => (
              <div key={i} className="card result-box">
                <h4 style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  <span className="badge badge-purple" style={{ marginRight: '0.75rem' }}>Q{i+1}</span>
                  {q.question}
                </h4>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[i] === opt.charAt(0);
                    const isCorrect = submitted && opt.charAt(0) === q.correct;
                    const isWrongSelected = submitted && isSelected && !isCorrect;

                    let className = 'quiz-option';
                    if (isSelected && !submitted) className += ' selected';
                    if (isCorrect) className += ' correct';
                    if (isWrongSelected) className += ' wrong';

                    return (
                      <div 
                        key={optIdx} 
                        className={className}
                        onClick={() => handleSelect(i, opt)}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {submitted && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${answers[i] === q.correct ? 'var(--green)' : '#ef4444'}` }}>
                    <strong>Explanation: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{q.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={submitQuiz} disabled={Object.keys(answers).length !== quizData.questions.length}>
                Submit Answers
              </button>
              {Object.keys(answers).length !== quizData.questions.length && (
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Answer all questions to submit ({Object.keys(answers).length}/{quizData.questions.length})
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
