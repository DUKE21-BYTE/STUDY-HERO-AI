import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge badge-purple" style={{ marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>
            <span>✨</span> Gemini 1.5 Flash Powered
          </div>
          <h1 className="hero-title">
            Transform Your Notes into <br />
            <span className="gradient-text">Interactive Learning</span>
          </h1>
          <p className="hero-subtitle">
            StudyHero AI automatically generates quizzes, summaries, essays, and predicted exams from your class notes or any topic. 
          </p>
          <div className="hero-actions">
            <Link href="/notes" className="btn btn-primary btn-lg">
              Upload Notes
            </Link>
            <Link href="/topic" className="btn btn-ghost btn-lg">
              Explore Topics
            </Link>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="hero-glow shape-1"></div>
        <div className="hero-glow shape-2"></div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-number gradient-text">13+</div>
          <div className="stat-label">Learning Modules</div>
        </div>
        <div className="stat-item">
          <div className="stat-number gradient-text-cyan">100%</div>
          <div className="stat-label">AI Powered</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ color: 'var(--gold-light)' }}>0</div>
          <div className="stat-label">Database Required</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything you need to <span className="gradient-text">master any subject</span></h2>
          <p className="section-subtitle">A complete suite of AI-powered tools designed to make studying faster, easier, and more engaging.</p>
        </div>

        <div className="grid-3">
          <FeatureCard 
            icon="📝" title="Notes Processor"
            desc="Upload PDFs, images, or text and let AI extract key concepts and structure."
            href="/notes"
          />
          <FeatureCard 
            icon="🏆" title="Exam Predictor"
            desc="Generate predicted exam papers with MCQs, short answers, and essays."
            href="/exam" glow
          />
          <FeatureCard 
            icon="✨" title="Story Learning"
            desc="Transform boring facts into engaging stories in superhero or fantasy themes."
            href="/story"
          />
          <FeatureCard 
            icon="🎯" title="MCQ Generator"
            desc="Instantly create multiple-choice tests to check your understanding."
            href="/mcq"
          />
          <FeatureCard 
            icon="🔢" title="Math Solver"
            desc="Step-by-step solutions for complex math equations with practice problems."
            href="/math"
          />
          <FeatureCard 
            icon="📄" title="Essay Assistant"
            desc="Draft complete academic essays from your notes with zero plagiarism risk."
            href="/essay"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card card-glow">
          <h2>Ready to become a Study Hero?</h2>
          <p>Start learning smarter today. No credit card required.</p>
          <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
            Go to Dashboard 🚀
          </Link>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
          padding: 8rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          overflow: hidden;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
        }
        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 1;
          opacity: 0.5;
        }
        .shape-1 {
          top: -10%; left: -10%;
          width: 500px; height: 500px;
          background: var(--accent-primary);
          animation: float 10s ease-in-out infinite alternate;
        }
        .shape-2 {
          bottom: -10%; right: -10%;
          width: 600px; height: 600px;
          background: #06b6d4;
          animation: float 12s ease-in-out infinite alternate-reverse;
        }
        
        .stats-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          padding: 3rem 2rem;
          background: var(--bg-card);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .stat-item { text-align: center; }
        .stat-number { font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); margin-bottom: 0.25rem; }
        .stat-label { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .features-section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header { text-align: center; margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto; }
        .section-title { margin-bottom: 1rem; }
        .section-subtitle { font-size: 1.1rem; }
        
        .cta-section {
          padding: 4rem 2rem 8rem;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-card {
          padding: 4rem 2rem;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--bg-card), rgba(124, 58, 237, 0.05));
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc, href, glow }) {
  return (
    <Link href={href} className={`card ${glow ? 'card-glow' : ''}`} style={{ display: 'block' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{desc}</p>
      <div style={{ color: glow ? 'var(--gold-light)' : 'var(--accent-light)', fontWeight: 600, fontSize: '0.875rem' }}>
        Try it out →
      </div>
    </Link>
  );
}
