'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function ExamPredictorContent() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [subject, setSubject] = useState('');
  const [config, setConfig] = useState({ count: 20, type: 'mixed', difficulty: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [examState, setExamState] = useState(null); // 'setup', 'reading', 'ready', 'exam'
  const [examData, setExamData] = useState(null);

  const generateExam = async () => {
    if (!input.trim() || !subject.trim()) {
      toast.error('Please enter the subject and syllabus notes.');
      return;
    }

    setLoading(true);
    setExamState('reading');
    const loadingToast = toast.loading('Analyzing syllabus and past trends... 🧠');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateExamQuestions', 
          content: `SUBJECT: ${subject}\n\nMATERIAL:\n${input}`,
          config 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setExamData(data.result);
      setExamState('ready');
      toast.success('Mock exam predicted & created!', { id: loadingToast });
    } catch (err) {
      toast.error('Prediction failed: ' + err.message, { id: loadingToast });
      setExamState('setup');
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    setExamState('exam');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Exam Predictor 🏆</h1>
        <p>Predict likely exam questions based on your notes or syllabus, and generate a full mock paper.</p>
      </div>

      {(!examState || examState === 'setup' || examState === 'reading') && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Subject / Course Name</label>
            <input 
              type="text"
              className="input" 
              placeholder="e.g. Introduction to Psychology (PSY101)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Syllabus / Lecture Notes</label>
            <textarea 
              className="textarea" 
              placeholder="Paste all the materials, topics, and notes you need to be tested on..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: '180px' }}
            />
          </div>

          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="input-label">Exam Length</label>
              <select className="select" value={config.count} onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}>
                <option value={10}>10 Questions (Popup Quiz)</option>
                <option value={20}>20 Questions (Midterm)</option>
                <option value={40}>40 Questions (Final Exam)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Question Types</label>
              <select className="select" value={config.type} onChange={(e) => setConfig({...config, type: e.target.value})}>
                <option value="mixed">Mixed Format (Standard)</option>
                <option value="mcq">Multiple Choice Only</option>
                <option value="short">Short Essay Only</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Difficulty Level</label>
              <select className="select" value={config.difficulty} onChange={(e) => setConfig({...config, difficulty: e.target.value})}>
                <option value="Easy">High School / Intro</option>
                <option value="Medium">Undergraduate</option>
                <option value="Hard">Advanced / Masters</option>
              </select>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateExam}
            disabled={loading || !input.trim() || !subject.trim()}
          >
            {loading ? <><span className="spinner"></span> Predicting Exam...</> : 'Predict & Generate Mock Exam 🔮'}
          </button>
        </div>
      )}

      {examState === 'ready' && examData && (
        <div className="card card-glow" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', animation: 'slideUp 0.4s ease' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {examData.examTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {examData.totalMarks} Total Marks • {config.count} Questions • {config.difficulty} Level
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={startExam}>
              Start Mock Exam ⏱️
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => setExamState('setup')}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {examState === 'exam' && examData && (
        <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
          
          <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 'var(--topnav-height)', zIndex: 10 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>{examData.examTitle}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{examData.instructions}</div>
            </div>
            <div className="badge badge-gold" style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}>
              Total Marks: {examData.totalMarks}
            </div>
          </div>

          {examData.sections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                {section.title}
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} className="exam-question">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <div className="question-number">{qIdx + 1}</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
                          {q.question}
                        </div>
                      </div>
                      <div className="marks-badge">[{q.marks} Marks]</div>
                    </div>

                    {section.type === 'mcq' && (
                      <div style={{ paddingLeft: '2.5rem', display: 'grid', gap: '0.5rem' }}>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'short' && (
                      <div style={{ paddingLeft: '2.5rem', marginTop: '1rem' }}>
                        <textarea className="textarea" placeholder="Write your answer clearly..." style={{ minHeight: '120px' }}></textarea>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <strong>Marking Guidelines:</strong> {q.guidelines}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
            <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ Print Exam Paper</button>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Self-grade your paper using the provided marking guidelines after you print or complete the mock exam.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}


export default function ExamPredictor() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ExamPredictorContent />
    </Suspense>
  );
}
