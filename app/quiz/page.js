'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function QuizGenerator() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [quizType, setQuizType] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const generateQuiz = async () => {
    if (!input.trim()) {
      toast.error('Please enter notes or a topic.');
      return;
    }

    setLoading(true);
    setQuizData(null);
    setRevealedAnswers({});
    
    const loadingToast = toast.loading('Brewing fresh questions... ☕');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateQuiz', 
          content: input,
          config: { quizType } 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setQuizData(data.result);
      toast.success('Quiz ready! Test yourself.', { id: loadingToast });
    } catch (err) {
      toast.error('Generation failed: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (index) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Active Recall Quiz ✏️</h1>
        <p>Generate short-answer questions to strengthen your memory retrieval.</p>
      </div>

      <div className="grid-2">
        <div className="form-column card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Provide Material</h3>
          <textarea 
            className="textarea" 
            placeholder="Paste notes, copy a Wikipedia article, or just type a broad topic like 'French Revolution'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ minHeight: '200px', marginBottom: '1.5rem' }}
          />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Customize Format</h3>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <select className="select" value={quizType} onChange={(e) => setQuizType(e.target.value)}>
              <option value="mixed">Mixed Types (Best for learning)</option>
              <option value="short_answer">Short Answer Only</option>
              <option value="fill_blank">Fill in the Blanks</option>
              <option value="concept">Concept Explanations</option>
            </select>
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateQuiz}
            disabled={loading || !input.trim()}
          >
            {loading ? <><span className="spinner"></span> Generating...</> : 'Generate active recall quiz'}
          </button>
        </div>

        <div className="output-column">
          {loading && (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', borderTopColor: 'var(--cyan)' }}></div>
              <h3 style={{ color: 'var(--text-primary)' }}>Analyzing Material</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Extracting key facts for testing...</p>
            </div>
          )}

          {!quizData && !loading && (
            <div className="card empty-state" style={{ height: '100%' }}>
              <div className="icon">🧠</div>
              <h3>Test Your Memory</h3>
              <p>Active recall is proven to be the most effective study method. Generate questions to test yourself.</p>
            </div>
          )}

          {quizData && !loading && (
            <div style={{ display: 'grid', gap: '1rem', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span><strong>{quizData.questions.length}</strong> questions generated</span>
                <button className="btn btn-sm btn-ghost" onClick={() => setRevealedAnswers({})}>Hide all answers</button>
              </div>

              {quizData.questions.map((q, i) => (
                <div key={i} className="card result-box" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div className="question-number">{i+1}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                        {q.question}
                      </p>
                      {q.hint && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>Hint: {q.hint}</p>}
                      
                      <div style={{ marginTop: '1rem' }}>
                        {revealedAnswers[i] ? (
                          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                            <strong style={{ color: 'var(--green)' }}>Answer: </strong>
                            <span style={{ color: 'var(--text-secondary)' }}>{q.answer}</span>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-sm btn-ghost" 
                            style={{ width: '100%', padding: '0.75rem', borderStyle: 'dashed' }}
                            onClick={() => toggleReveal(i)}
                          >
                            👁️ Reveal Answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
