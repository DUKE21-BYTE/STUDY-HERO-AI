'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { recordTopicStudied } from '@/lib/analytics';
import Link from 'next/link';

export default function TopicExplorer() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('undergraduate');
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState(null);

  const generatePack = async () => {
    if (!subject.trim() || !topic.trim()) {
      toast.error('Please enter both subject and topic.');
      return;
    }

    setLoading(true);
    setPack(null);
    const loadingToast = toast.loading('Generating complete study pack... 📚');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateTopicPack', 
          content: topic,
          config: { subject, level } 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPack(data.result);
      recordTopicStudied(topic, subject);
      toast.success('Study pack generated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to generate pack: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Topic Explorer 🔍</h1>
        <p>No notes? No problem. Enter any academic topic to generate a comprehensive study pack from scratch.</p>
      </div>

      {!pack && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="input-label">Subject</label>
              <input 
                type="text"
                className="input" 
                placeholder="e.g. Computer Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Academic Level</label>
              <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="high_school">High School</option>
                <option value="undergraduate">Undergraduate (University)</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Specific Topic / Question</label>
            <input 
              type="text"
              className="input" 
              placeholder="e.g. Memory Management & Paging OR The Causes of World War II"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generatePack}
            disabled={loading || !subject.trim() || !topic.trim()}
          >
            {loading ? <><span className="spinner"></span> Compiling Knowledge...</> : 'Generate Complete Study Pack 📚'}
          </button>
        </div>
      )}

      {pack && (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>{pack.subject} • {pack.level}</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '2rem' }}>
                {pack.topic}
              </h2>
            </div>
            <button className="btn btn-ghost" onClick={() => setPack(null)}>🔍 Search New Topic</button>
          </div>

          <div className="card card-glow" style={{ marginBottom: '2rem', padding: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Overview</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{pack.overview}</p>
          </div>

          <div className="grid-2">
            
            {/* Left Column: Notes & Summary */}
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div className="card result-box">
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📑 Structured Notes</span>
                  <Link href={`/essay?topic=${encodeURIComponent(pack.topic)}`} className="btn btn-sm btn-ghost">Write Essay Instead</Link>
                </h3>
                
                {pack.notes.sections.map((sec, i) => (
                  <div key={i} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent-light)', marginBottom: '0.75rem' }}>{sec.heading}</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>{sec.content}</p>
                    <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {(sec.keyPoints || []).map((kp, j) => <li key={j}>{kp}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="card result-box">
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  🔑 Key Concepts Glossary
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {pack.keyConcepts.map((item, i) => (
                    <div key={i} style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ color: 'var(--gold-light)', display: 'block', marginBottom: '0.25rem' }}>{item.concept}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.definition}</div>
                      {item.example && (
                        <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ex: {item.example}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Testing & summary */}
            <div style={{ display: 'grid', gap: '2rem' }}>
              
              <div className="card result-box card-gold">
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  ⚡ Executive Summary
                </h3>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {pack.summary.map((pt, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="card result-box">
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  🎯 Mini MCQ Test
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {pack.mcqs.map((q, i) => (
                    <div key={i} style={{ background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontWeight: 500, marginBottom: '0.75rem' }}>{i+1}. {q.question}</div>
                      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                        {q.options.map((opt, j) => (
                          <div key={j} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px', border: opt.charAt(0) === q.correct ? '1px solid var(--green)' : '1px solid transparent' }}>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--green)' }}><strong>Answer: {q.correct}</strong> — {q.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card result-box">
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  🎓 Likely Exam Questions
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {pack.examQuestions.map((q, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Q: {q.question}</strong>
                        <span className="badge badge-purple">{q.marks} Marks</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
                        <strong>Model Answer Structure:</strong><br/>
                        {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
