'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { 
    section: 'Overview',
    items: [
      { href: '/', icon: '🏠', label: 'Home' },
      { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    ]
  },
  {
    section: 'Learn',
    items: [
      { href: '/notes', icon: '📝', label: 'Notes Processor' },
      { href: '/topic', icon: '🔍', label: 'Topic Explorer' },
    ]
  },
  {
    section: 'Generate',
    items: [
      { href: '/mcq', icon: '🎯', label: 'MCQ Generator' },
      { href: '/quiz', icon: '✏️', label: 'Quiz Generator' },
      { href: '/summary', icon: '📋', label: 'Summarizer' },
      { href: '/essay', icon: '📄', label: 'Essay Writer' },
      { href: '/slides', icon: '🖼️', label: 'Slide Generator' },
      { href: '/story', icon: '✨', label: 'Story Learning' },
    ]
  },
  {
    section: 'Tools',
    items: [
      { href: '/math', icon: '🔢', label: 'Math Solver' },
      { href: '/exam', icon: '🏆', label: 'Exam Predictor' },
      { href: '/humanizer', icon: '🤖', label: 'AI Humanizer' },
    ]
  },
  {
    section: 'Progress',
    items: [
      { href: '/analytics', icon: '📈', label: 'Analytics' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className="sidebar" style={{ width: collapsed ? '72px' : '260px' }}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🧠</div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name gradient-text">StudyHero</span>
              <span className="logo-sub">AI Platform</span>
            </div>
          )}
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="nav-section">
              {!collapsed && (
                <span className="nav-section-label">{section.section}</span>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {isActive && !collapsed && <span className="active-dot" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-footer-card">
              <span className="footer-icon">⚡</span>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Free Tier</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gemini 1.5 Flash</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          background: rgba(10, 11, 20, 0.95);
          border-right: 1px solid var(--border);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow: hidden;
          transition: width 0.3s ease;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          min-height: 64px;
        }
        .logo-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
          animation: float 3s ease-in-out infinite;
        }
        .logo-text { flex: 1; min-width: 0; }
        .logo-name { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; display: block; }
        .logo-sub { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
        .collapse-btn {
          width: 24px; height: 24px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-glass);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          flex-shrink: 0;
          margin-left: auto;
        }
        .collapse-btn:hover { border-color: var(--accent-light); color: var(--accent-light); }
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 0.5rem;
        }
        .nav-section { margin-bottom: 0.5rem; }
        .nav-section-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          padding: 0.25rem 0.75rem;
          margin-bottom: 0.25rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          position: relative;
          transition: all 0.2s ease;
          text-decoration: none;
          margin-bottom: 0.125rem;
        }
        .nav-item:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: rgba(124, 58, 237, 0.15);
          color: var(--accent-light);
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .nav-icon { font-size: 1.1rem; flex-shrink: 0; }
        .nav-label { flex: 1; }
        .active-dot {
          width: 6px; height: 6px;
          background: var(--accent-light);
          border-radius: 50%;
        }
        .sidebar-footer {
          padding: 0.75rem 0.75rem 1rem;
          border-top: 1px solid var(--border);
        }
        .sidebar-footer-card {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: var(--radius-md);
          padding: 0.625rem 0.75rem;
        }
        .footer-icon { font-size: 1rem; }
      `}</style>
    </>
  );
}
