'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStats } from '@/lib/analytics';

export default function Dashboard() {
  const [stats, setStats] = useState({ streak: 0, accuracy: 0, totalTopics: 0, recentScores: [], weakTopics: [] });

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome Back, Hero 👋</h1>
        <p>Here's a summary of your learning progress and quick actions.</p>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-light)' }}>
          <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: 'var(--accent-light)' }}>🔥</div>
          <div>
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)' }}>🎯</div>
          <div>
            <div className="stat-value">{stats.accuracy}%</div>
            <div className="stat-label">Quiz Accuracy</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--cyan)' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)' }}>📚</div>
          <div>
            <div className="stat-value">{stats.totalTopics}</div>
            <div className="stat-label">Topics Studied</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Quick Actions
          </h3>
          <div className="grid-2">
            <Link href="/notes" className="card card-hover-glow" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Process Notes</h4>
              <p style={{ fontSize: '0.8rem' }}>Extract key concepts from uploaded materials.</p>
            </Link>
            <Link href="/mcq" className="card card-hover-glow" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Generate Quiz</h4>
              <p style={{ fontSize: '0.8rem' }}>Create custom MCQs to test your knowledge.</p>
            </Link>
            <Link href="/math" className="card card-hover-glow" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔢</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Solve Math</h4>
              <p style={{ fontSize: '0.8rem' }}>Get step-by-step solutions to problems.</p>
            </Link>
            <Link href="/exam" className="card card-hover-glow card-gold" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Predict Exam</h4>
              <p style={{ fontSize: '0.8rem' }}>Simulate a full exam based on notes.</p>
            </Link>
          </div>
        </div>

        {/* Needs Revision / Weak Spots */}
        <div className="dashboard-section">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🧠</span> Recommending Revision
          </h3>
          <div className="card" style={{ height: 'calc(100% - 2.5rem)' }}>
            {stats.weakTopics.length > 0 ? (
              <div className="weak-topics-list">
                {stats.weakTopics.map((item, i) => (
                  <div key={i} className="weak-topic-item">
                    <div className="wt-info">
                      <div className="wt-name">{item.topic}</div>
                      <div className="wt-accuracy">{item.accuracy}% master accuracy</div>
                    </div>
                    <Link href={`/topic?q=${encodeURIComponent(item.topic)}`} className="btn btn-sm btn-ghost">
                      Revise
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <div className="icon">🌟</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>You're doing great!</h4>
                <p style={{ fontSize: '0.85rem' }}>Take some quizzes to identify weak areas.</p>
                <Link href="/quiz" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Take a Quiz</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-hover-glow { transition: all 0.2s; }
        .card-hover-glow:hover { border-color: var(--accent-light); }
        .weak-topic-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .weak-topic-item:last-child { border-bottom: none; }
        .wt-name { font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
        .wt-accuracy { font-size: 0.8rem; color: #ef4444; }
      `}</style>
    </div>
  );
}
