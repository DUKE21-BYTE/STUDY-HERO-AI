'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EssayWriter() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams?.get('topic') || '';
  
  const [topic, setTopic] = useState(initialTopic);
  const [notes, setNotes] = useState('');
  const [config, setConfig] = useState({ length: 800, tone: 'academic' });
  const [loading, setLoading] = useState(false);
  const [essay, setEssay] = useState(null);

  const generateEssay = async () => {
    if (!topic.trim()) {
      toast.error('Please enter an essay topic.');
      return;
    }

    setLoading(true);
    setEssay(null);
    const loadingToast = toast.loading('Drafting your essay... 📄');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateEssay', 
          content: topic,
          config: { ...config, notes }
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setEssay(data.result);
      toast.success('Essay drafted successfully!', { id: loadingToast });
    } catch (err) {
      toast.error('Drafting failed: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const copyEssay = () => {
    if (!essay) return;
    const text = `${essay.title}\n\n${essay.introduction}\n\n${essay.body.map(b => `${b.heading}\n${b.content}`).join('\n\n')}\n\n${essay.conclusion}`;
    navigator.clipboard.writeText(text);
    toast.success('Full essay copied to clipboard!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Essay Writing Assistant 📄</h1>
        <p>Generate beautifully structured, plagiarism-safe essays from notes or topics.</p>
      </div>

      {!essay && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Essay Topic / Prompt</label>
            <input 
              type="text"
              className="input" 
              placeholder="e.g. The Socio-economic Impact of the Industrial Revolution"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Reference Notes (Optional, keeps AI accurate to your class)</label>
            <textarea 
              className="textarea" 
              placeholder="Paste any specific points, quotes, or notes that must be included..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="input-label">Target Length</label>
              <select 
                className="select" 
                value={config.length} 
                onChange={(e) => setConfig({...config, length: parseInt(e.target.value)})}
              >
                <option value={500}>~500 Words (Short Essay)</option>
                <option value={800}>~800 Words (Standard Essay)</option>
                <option value={1500}>~1500 Words (Detailed Paper)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Tone & Style</label>
              <select 
                className="select"
                value={config.tone}
                onChange={(e) => setConfig({...config, tone: e.target.value})}
              >
                <option value="academic">Formal Academic (University)</option>
                <option value="persuasive">Persuasive / Argumentative</option>
                <option value="simple">Simple & Clear (High School)</option>
              </select>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateEssay}
            disabled={loading || !topic.trim()}
          >
            {loading ? <><span className="spinner"></span> Researching & Drafting...</> : 'Write Essay ✍️'}
          </button>
        </div>
      )}

      {essay && (
        <div className="essay-container" style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
          <div className="card" style={{ padding: '3rem', background: 'var(--bg-card)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <button className="btn btn-sm btn-ghost" onClick={() => setEssay(null)} style={{ marginBottom: '1rem' }}>← New Essay</button>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '2.5rem', lineHeight: 1.2 }}>{essay.title}</h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>{config.length} Words Target</div>
                <div><button className="btn btn-primary" onClick={copyEssay}>📋 Copy Full Text</button></div>
              </div>
            </div>

            <div className="essay-content" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              
              {/* Intro */}
              <div className="essay-section" style={{ marginBottom: '2.5rem' }}>
                <div className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Introduction</div>
                <p>{essay.introduction}</p>
              </div>

              {/* Body */}
              {essay.body.map((p, i) => (
                <div key={i} className="essay-section" style={{ marginBottom: '2.5rem' }}>
                  <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>Body Paragraph {i+1}</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.3rem' }}>{p.heading}</h3>
                  <p>{p.content}</p>
                </div>
              ))}

              {/* Conclusion */}
              <div className="essay-section" style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <div className="badge badge-pink" style={{ marginBottom: '1rem' }}>Conclusion</div>
                <p>{essay.conclusion}</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
