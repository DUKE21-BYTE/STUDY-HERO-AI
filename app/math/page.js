'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { fileToBase64 } from '@/lib/gemini';

export default function MathSolver() {
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image for math vision solving.');
      return;
    }

    setLoading(true);
    setSolution(null);
    const loadingToast = toast.loading('Vision AI is scanning your math problem... 📸');
    
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'solveMath',
          content: '',
          imageBase64: base64,
          mimeType: file.type
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSolution(data.result);
      toast.success('Problem solved!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to solve image: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const solveTextEquation = async () => {
    if (!equation.trim()) {
      toast.error('Please enter an equation.');
      return;
    }

    setLoading(true);
    setSolution(null);
    const loadingToast = toast.loading('Calculating step-by-step solution... 🧮');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'solveMath', content: equation })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSolution(data.result);
      toast.success('Solved!', { id: loadingToast });
    } catch (err) {
      toast.error('Solve failed: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Math Solver 🔢</h1>
        <p>Type any equation or snap a photo of a math problem to get step-by-step guidance.</p>
      </div>

      <div className="grid-2">
        <div className="input-column form-group">
          
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {isDragActive ? 'Drop math image here' : 'Take a photo or upload homework'}
            </h4>
            <p style={{ fontSize: '0.85rem' }}>Upload images containing math equations</p>
          </div>

          <div className="section-divider">
            <span>OR TYPE IT OUT</span>
          </div>

          <textarea 
            className="textarea" 
            placeholder="e.g. Integrate 3x^2 + 5x with respect to x,  OR  Solve for x: 2x + 7 = 19" 
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            style={{ minHeight: '120px' }}
          />

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            onClick={solveTextEquation}
            disabled={loading || (!equation.trim() && !solution)}
          >
            {loading ? <><span className="spinner"></span> Solving...</> : 'Solve Step-by-Step ✨'}
          </button>
        </div>

        <div className="output-column">
          <div className="card result-box" style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            
            {!solution && !loading && (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <div className="icon">🧮</div>
                <h3>Let's solve together</h3>
                <p>Detailed step-by-step logic will appear here.</p>
              </div>
            )}

            {loading && (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem', borderTopColor: 'var(--gold)' }}></div>
                <h4 style={{ color: 'var(--gold-light)' }}>Crunching the numbers...</h4>
              </div>
            )}

            {solution && !loading && (
              <div className="solution-content" style={{ animation: 'slideUp 0.4s ease' }}>
                <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>Problem Solved</div>
                
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>The Problem</h3>
                <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                  {solution.problem}
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Step-by-Step Approach</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Enter a problem below or click the camera icon to upload a photo of your math work. We&apos;ll explain it step-by-step.</p>
                <div style={{ marginBottom: '2.5rem' }}>
                  {solution.steps.map((s, i) => (
                    <div key={i} className="math-step">
                      <div className="step-indicator">
                        <div className="step-number">{s.step}</div>
                        <span>{s.description}</span>
                      </div>
                      <div className="math-work">{s.work}</div>
                      {s.result && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>→ {s.result}</div>}
                    </div>
                  ))}
                </div>

                <div className="card card-gold" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
                  <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--gold)', marginBottom: '0.5rem' }}>Final Answer</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {solution.finalAnswer}
                  </div>
                </div>

                {solution.practiceQuestions && solution.practiceQuestions.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Similar Practice Questions</h3>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                      {solution.practiceQuestions.map((pq, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>{pq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
