import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-icon">🎓</span> StudyHero AI
            </Link>
            <p className="footer-tagline">
              Your AI-powered study companion transforming way students learn, revise, and excel.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
              <a href="#" className="social-link" aria-label="GitHub">git</a>
              <a href="#" className="social-link" aria-label="Discord">dis</a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/pricing">StudyHero Premium</Link></li>
              <li><Link href="/integrity">Academic Integrity</Link></li>
              <li><Link href="/careers">Jobs</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Tools Column */}
          <div className="footer-links">
            <h4>Study Tools</h4>
            <ul>
              <li><Link href="/notes">AI Notes Processor</Link></li>
              <li><Link href="/math">Math Problem Solver</Link></li>
              <li><Link href="/quiz">AI Quiz Generator</Link></li>
              <li><Link href="/essay">Essay Assistant</Link></li>
              <li><Link href="/topic">Topic Explorer</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/faq">F.A.Q.</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/newsroom">Newsroom</Link></li>
              <li><Link href="/app">Get the App</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© {currentYear} StudyHero AI. All rights reserved.</span>
            <div className="legal-links">
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/cookies">Cookie Settings</Link>
            </div>
          </div>
          <p className="footer-disclaimer">
            StudyHero AI promotes ethical use of AI. Always ensure your academic work adheres to your institution's guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
