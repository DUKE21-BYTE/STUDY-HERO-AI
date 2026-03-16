'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

function SummaryGeneratorContent() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [config, setConfig] = useState({ format: 'bullet', length: 'medium' });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const generateSummary = async () => {
    if (!input.trim()) {
      toast.error('Please enter text to summarize.');
      return;
    }

    setLoading(true);
    setSummary('');
    const loadingToast = toast.loading('Distilling information... 📋');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateSummary', 
          content: input,
          config 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSummary(data.result);
      toast.success('Summary generated!', { id: loadingToast });
    } catch (err) {
      toast.error('Generation failed: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Smart Summarizer 📋</h1>
        <p>Condense long notes, articles, or lectures into bite-sized highlights.</p>
      </div>

      <div className="grid-2">
        <div className="form-column">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Source Material</h3>
            <textarea 
              className="textarea" 
              placeholder="Paste your long text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>

          <div className="card form-group">
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Summary Options</h3>
            <div className="grid-2">
              <div>
                <label className="input-label">Format</label>
                <select 
                  className="select" 
                  value={config.format} 
                  onChange={(e) => setConfig({...config, format: e.target.value})}
                >
                  <option value="bullet">Bullet Points</option>
                  <option value="paragraph">Flowing Paragraphs</option>
                  <option value="revision">Quick Revision (Flashcard style)</option>
                  <option value="exam">Exam Focused (Key facts only)</option>
                </select>
              </div>
              <div>
                <label className="input-label">Length</label>
                <select 
                  className="select" 
                  value={config.length} 
                  onChange={(e) => setConfig({...config, length: e.target.value})}
                >
                  <option value="short">Short & Sweet</option>
                  <option value="medium">Medium Detail</option>
                  <option value="detailed">Comprehensive</option>
                </select>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
              onClick={generateSummary}
              disabled={loading || !input.trim()}
            >
              {loading ? <><span className="spinner"></span> Summarizing...</> : 'Generate Summary ✨'}
            </button>
          </div>
        </div>

        <div className="output-column">
          <div className="card result-box" style={{ height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {!summary && !loading && (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <div className="icon">✂️</div>
                <h3>Cut the Fluff</h3>
                <p>Paste text on the left to get a focused summary.</p>
              </div>
            )}

            {loading && (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem' }}></div>
                <h4 style={{ color: 'var(--text-primary)' }}>Compressing Knowledge...</h4>
              </div>
            )}

            {summary && !loading && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Generated Summary</h3>
                  <button className="btn btn-sm btn-ghost" onClick={copyToClipboard}>📋 Copy text</button>
                </div>
                <div className="prose" style={{ flex: 1, overflowY: 'auto', animation: 'fadeIn 0.4s ease' }}>
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function SummaryGenerator() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SummaryGeneratorContent />
    </Suspense>
  );
}
