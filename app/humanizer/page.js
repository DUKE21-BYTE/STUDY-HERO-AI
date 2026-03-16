'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TextHumanizer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const humanize = async () => {
    if (!input.trim()) {
      toast.error('Please paste some text to humanize.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Removing AI robotics... 🤖➡️👤');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'humanizer', content: input })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.result);
      toast.success('Text humanized successfully!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to humanize: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Text Humanizer 👤</h1>
        <p>Rewrite stiff, AI-sounding generated text (like essays or summaries) into natural, flowing human language.</p>
      </div>

      <div className="grid-2">
        <div className="form-column">
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>🤖 Original AI Text</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setInput('')}>Clear</button>
            </div>
            
            <textarea 
              className="textarea" 
              placeholder="Paste ChatGPT/Gemini output here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, minHeight: '400px', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}
            />

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={humanize}
              disabled={loading || !input.trim()}
            >
              {loading ? <><span className="spinner"></span> Humanizing...</> : 'Make it sound Human 🪄'}
            </button>
          </div>
        </div>

        <div className="output-column">
          <div className="card result-box" style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>👤 Humanized Result</h3>
              {result && !loading && (
                <button className="btn btn-sm btn-ghost" onClick={copyToClipboard}>📋 Copy</button>
              )}
            </div>

            {!result && !loading && (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <div className="icon">🎭</div>
                <h3>Bypass AI Detectors</h3>
                <p>Results will appear here with better flow, varied sentence structures, and a natural tone.</p>
              </div>
            )}

            {loading && (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem', borderTopColor: 'var(--accent-light)' }}></div>
                <h4 style={{ color: 'var(--accent-light)' }}>Rewriting sentences...</h4>
              </div>
            )}

            {result && !loading && (
              <div className="textarea" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', cursor: 'text', animation: 'fadeIn 0.4s ease' }}>
                {result.split('\n').map((paragraph, i) => (
                  <p key={i} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
