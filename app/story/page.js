'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

const THEMES = [
  { id: 'superhero', name: 'Superhero Universe', icon: '🦸‍♂️', desc: 'Epic battles and superhuman feats' },
  { id: 'fantasy', name: 'High Fantasy', icon: '🏰', desc: 'Magic, dragons, and ancient kingdoms' },
  { id: 'anime', name: 'Shonen Anime', icon: '⚔️', desc: 'Over-the-top action and power-ups' },
  { id: 'scifi', name: 'Space Sci-Fi', icon: '🚀', desc: 'Galactic empires and advanced tech' },
  { id: 'mystery', name: 'Noir Mystery', icon: '🕵️‍♂️', desc: 'Gritty detective investigations' }
];

function StoryLearningContent() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [theme, setTheme] = useState('superhero');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);

  const generateStory = async () => {
    if (!input.trim()) {
      toast.error('Please enter the concepts or notes to teach.');
      return;
    }

    setLoading(true);
    setStory(null);
    const loadingToast = toast.loading('Weaving your educational tale... ✨');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateStory', 
          content: input,
          config: { theme } 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setStory(data.result);
      toast.success('Story generated! Happy reading.', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to generate story: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with asterisks as highlighted key terms
  const renderHighlightedText = (text) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} style={{ color: 'var(--gold-light)', background: 'rgba(245, 158, 11, 0.1)', padding: '0 4px', borderRadius: '4px' }}>{part.slice(1, -1)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Story-Based Learning ✨</h1>
        <p>Turn dry facts into unforgettable narratives using the power of thematic storytelling.</p>
      </div>

      <div className="grid-2">
        <div className="form-column">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>1. What are we learning?</h3>
            <textarea 
              className="textarea" 
              placeholder="Paste notes or type a topic (e.g. 'How the human heart works' or 'The rules of thermodynamics')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: '180px' }}
            />
          </div>

          <div className="card form-group">
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Choose a Universe</h3>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {THEMES.map(t => (
                <div 
                  key={t.id}
                  className={`card ${theme === t.id ? 'card-gold' : ''}`}
                  onClick={() => setTheme(t.id)}
                  style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', background: theme === t.id ? 'var(--bg-card-hover)' : 'var(--bg-card)' }}
                >
                  <div style={{ fontSize: '2rem' }}>{t.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: theme === t.id ? 'var(--gold-light)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={generateStory}
              disabled={loading || !input.trim()}
            >
              {loading ? <><span className="spinner"></span> Writing Story...</> : 'Generate Story ✨'}
            </button>
          </div>
        </div>

        <div className="output-column">
          {loading && (
            <div className="card" style={{ height: '100%', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', borderTopColor: 'var(--accent-light)' }}></div>
              <h3 style={{ color: 'var(--text-primary)' }}>Writing your epic tale...</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Weaving concepts into narrative.</p>
            </div>
          )}

          {!story && !loading && (
            <div className="card empty-state" style={{ height: '100%', minHeight: '600px' }}>
              <div className="icon">📖</div>
              <h3>Stories stick.</h3>
              <p>Our brains evolved for storytelling. Use this tool to remember dry facts by converting them into memorable plots and characters.</p>
            </div>
          )}

          {story && !loading && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>{THEMES.find(t => t.id === story.theme)?.name || theme} Theme</div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>{story.title}</h1>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{story.setting}</p>
                </div>

                <div className="story-content">
                  {story.chapters.map((chapter, i) => (
                    <div key={i} className="story-chapter" style={{ background: 'var(--bg-card)' }}>
                      <div className="chapter-label">Chapter {i + 1} • Teaches: {chapter.concept}</div>
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{chapter.chapterTitle}</h3>
                      <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {renderHighlightedText(chapter.content)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="story-chapter" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  <h3 style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span>🧠</span> The Lesson
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{renderHighlightedText(story.recap)}</p>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Glossary of Key Terms</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {story.keyTermsGlossary.map((term, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                        <span style={{ color: 'var(--gold-light)', fontWeight: 600, minWidth: '150px' }}>{term.term}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{term.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function StoryLearning() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <StoryLearningContent />
    </Suspense>
  );
}
