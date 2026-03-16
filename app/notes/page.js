'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { fileToBase64 } from '@/lib/gemini';
import Link from 'next/link';

export default function NotesProcessor() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // Process image using vision model via API
      setLoading(true);
      const loadingToast = toast.loading('Reading image...');
      
      try {
        const base64 = await fileToBase64(file);
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'analyzeNotes',
            content: 'Please extract all notes from this image.',
            imageBase64: base64,
            mimeType: file.type
          })
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
        toast.success('Notes processed successfully!', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to process image: ' + err.message, { id: loadingToast });
      } finally {
        setLoading(false);
      }
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => setText(reader.result);
      reader.readAsText(file);
      toast. सफलता('Text file loaded. Click Analyze to process.');
    } else {
      toast.error('Unsupported file type. Please upload images or text files.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const analyzeNotes = async () => {
    if (!text.trim()) {
      toast.error('Please enter some notes to analyze.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('AI is analyzing your notes... 🧠');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'analyzeNotes', content: text })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.result);
      toast.success('Analysis complete!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to analyze: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>AI Notes Processor 📝</h1>
        <p>Upload files or paste your text notes to instantly extract organized knowledge.</p>
      </div>

      <div className="grid-2">
        {/* Input Column */}
        <div className="input-column form-group">
          
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📥</div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {isDragActive ? 'Drop notes here...' : 'Upload Notes Image or File'}
            </h4>
            <p style={{ fontSize: '0.85rem' }}>Drag & drop images, screenshots, or .txt files</p>
          </div>

          <div className="section-divider">
            <span>OR PASTE TEXT</span>
          </div>

          <textarea 
            className="textarea" 
            placeholder="Paste your raw, messy notes here..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: '300px' }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={analyzeNotes}
              disabled={loading || (!text.trim() && !result)}
            >
              {loading ? (
                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span> Processing...</>
              ) : '✨ Analyze Notes'}
            </button>
            <button className="btn btn-ghost" onClick={clear}>Clear</button>
          </div>
        </div>

        {/* Output Column */}
        <div className="output-column">
          <div className="result-box" style={{ height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            
            {!result && !loading && (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <div className="icon">🔍</div>
                <h3>Awaiting Input</h3>
                <p>Processed structural data will appear here.</p>
              </div>
            )}

            {loading && (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem' }}></div>
                <h4 style={{ color: 'var(--accent-light)' }}>Extracting Knowledge...</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Identifying concepts and structuring data.</p>
              </div>
            )}

            {result && !loading && (
              <div className="result-content" style={{ animation: 'fadeIn 0.4s ease' }}>
                <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>Analysis Complete</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {result.title || 'Extracted Notes'}
                </h2>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', borderLeft: '3px solid var(--accent-light)', paddingLeft: '1rem' }}>
                  {result.summary}
                </p>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔑 Key Concepts
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {(result.keyConcepts || []).map((c, i) => (
                    <span key={i} className="badge badge-cyan">{c}</span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📚 Key Terms
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
                  {(result.keyTerms || []).map((t, i) => (
                    <div key={i} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ color: 'var(--gold-light)' }}>{t.term}</strong>: <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.definition}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Generate materials building on this data
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Link href={`/mcq?notes=${encodeURIComponent(text.substring(0, 1000))}`} className="btn btn-sm btn-ghost">🎯 Create MCQs</Link>
                    <Link href={`/quiz?notes=${encodeURIComponent(text.substring(0, 1000))}`} className="btn btn-sm btn-ghost">✏️ Generate Quiz</Link>
                    <Link href={`/summary?notes=${encodeURIComponent(text.substring(0, 1000))}`} className="btn btn-sm btn-ghost">📋 Summarize</Link>
                    <Link href={`/story?notes=${encodeURIComponent(text.substring(0, 1000))}`} className="btn btn-sm btn-ghost">✨ Next: Story Mode</Link>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
