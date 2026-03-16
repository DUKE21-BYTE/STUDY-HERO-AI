'use client';
import { useState, useEffect } from 'react';
import { getStreak } from '@/lib/analytics';

const pageTitles = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/notes': 'Notes Processor',
  '/topic': 'Topic Explorer',
  '/mcq': 'MCQ Generator',
  '/quiz': 'Quiz Generator',
  '/summary': 'Summarizer',
  '/essay': 'Essay Writer',
  '/slides': 'Slide Generator',
  '/story': 'Story Learning',
  '/math': 'Math Solver',
  '/exam': 'Exam Predictor',
  '/humanizer': 'AI Humanizer',
  '/analytics': 'Analytics',
};

export default function TopNav({ pathname }) {
  const [streak, setStreak] = useState(0);
  const title = pageTitles[pathname] || 'StudyHero AI';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(getStreak());
  }, []);

  return (
    <>
      <header className="topnav">
        <div className="topnav-left">
          <h2 className="topnav-title">{title}</h2>
        </div>
        <div className="topnav-right">
          {streak > 0 && (
            <div className="streak-badge">
              <span>🔥</span>
              <span>{streak} day streak</span>
            </div>
          )}
          <div className="topnav-avatar">
            <span>S</span>
          </div>
        </div>
      </header>
      <style jsx>{`
        .topnav {
          position: fixed;
          top: 0;
          right: 0;
          left: var(--sidebar-width);
          height: var(--topnav-height);
          background: rgba(10, 11, 20, 0.9);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 90;
          transition: left 0.3s ease;
        }
        .topnav-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .topnav-right { display: flex; align-items: center; gap: 1rem; }
        .streak-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-full);
          padding: 0.375rem 0.875rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold-light);
        }
        .topnav-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--accent-primary), #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          box-shadow: 0 0 12px var(--accent-glow);
        }
      `}</style>
    </>
  );
}
