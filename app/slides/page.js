'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function SlideGeneratorContent() {
  const searchParams = useSearchParams();
  const initialNotes = searchParams?.get('notes') || '';
  
  const [input, setInput] = useState(initialNotes);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const generateSlides = async () => {
    if (!input.trim()) {
      toast.error('Please enter notes or content to convert into slides.');
      return;
    }

    setLoading(true);
    setDeck(null);
    const loadingToast = toast.loading('Designing presentation... 🖼️');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'generateSlides', 
          content: input,
          config: { topic } 
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setDeck(data.result);
      setActiveSlide(0);
      toast.success('Slide deck ready!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to generate slides: ' + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (activeSlide < deck.slides.length - 1) setActiveSlide(activeSlide + 1);
  };
  
  const prevSlide = () => {
    if (activeSlide > 0) setActiveSlide(activeSlide - 1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Presentation Slides 🖼️</h1>
        <p>Convert your notes into an instantly structured slide deck outline for presentations or revision.</p>
      </div>

      {!deck && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Presentation Topic (Optional)</label>
            <input 
              type="text"
              className="input" 
              placeholder="e.g. The Causes of World War I"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Reference Material / Notes</label>
            <textarea 
              className="textarea" 
              placeholder="Paste the research notes, essay, or summary that you want converted into slides..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: '250px' }}
            />
          </div>

          <button 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateSlides}
            disabled={loading || !input.trim()}
          >
            {loading ? <><span className="spinner"></span> Generating Deck...</> : 'Create Slide Deck Outline 🖼️'}
          </button>
        </div>
      )}

      {deck && (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>{deck.presentationTitle}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setDeck(null)}>← New Presentation</button>
          </div>

          {/* Slide Presenter View */}
          <div className="slide-card" style={{ marginBottom: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Slide Navigation */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1rem', zIndex: 10 }}>
              <button className="btn btn-icon btn-ghost" onClick={prevSlide} disabled={activeSlide === 0}>←</button>
              <span style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                Slide {activeSlide + 1} of {deck.slides.length}
              </span>
              <button className="btn btn-icon btn-ghost" onClick={nextSlide} disabled={activeSlide === deck.slides.length - 1}>→</button>
            </div>

            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '3rem' }}>
              {deck.slides[activeSlide].type === 'title' && (
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    {deck.slides[activeSlide].title}
                  </h1>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-light)', fontWeight: 400 }}>
                    {deck.slides[activeSlide].subtitle}
                  </h3>
                </div>
              )}

              {deck.slides[activeSlide].type !== 'title' && (
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    {deck.slides[activeSlide].title}
                  </h2>
                  <ul style={{ paddingLeft: '2rem', fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 2 }}>
                    {(deck.slides[activeSlide].points || []).map((pt, i) => (
                      <li key={i} style={{ marginBottom: '1rem' }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Speaker Notes */}
          {deck.slides[activeSlide].note && (
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)', borderStyle: 'dashed', padding: '1.5rem' }}>
              <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Speaker Notes</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontStyle: 'italic' }}>
                {deck.slides[activeSlide].note}
              </p>
            </div>
          )}

          {/* Slide Grid Preview */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>All Slides Preview</h3>
            <div className="grid-4">
              {deck.slides.map((slide, i) => (
                <div 
                  key={i} 
                  className="card" 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '1rem', 
                    aspectRatio: '16/9', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: activeSlide === i ? '2px solid var(--accent-primary)' : '1px solid var(--border)' 
                  }}
                  onClick={() => setActiveSlide(i)}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 'auto' }}>Slide {i + 1}</div>
                  <h4 style={{ fontSize: '0.9rem', color: slide.type === 'title' ? 'var(--text-primary)' : 'var(--gold-light)', margin: '0.5rem 0', textAlign: slide.type === 'title' ? 'center' : 'left' }}>
                    {slide.title}
                  </h4>
                  {slide.type !== 'title' && slide.points && (
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>• {slide.points[0]}...</div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


export default function SlideGenerator() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SlideGeneratorContent />
    </Suspense>
  );
}
