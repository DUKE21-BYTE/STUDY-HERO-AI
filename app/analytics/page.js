'use client';
import { useState, useEffect } from 'react';
import { getStats, getQuizScores, getTopicsStudied } from '@/lib/analytics';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setStats(getStats());
    setHistory(getQuizScores().reverse()); // Newest first
    setTopics(getTopicsStudied().sort((a,b) => b.count - a.count));
  }, []);

  if (!stats) return <div className="page-container"><div className="spinner" style={{ margin: '4rem auto' }}></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Performance Analytics 📈</h1>
        <p>Track your study progress, master your weak spots, and keep your streak alive.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card card-glow" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔥</div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>{stats.streak}</h2>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Day Study Streak</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: stats.accuracy >= 80 ? 'var(--green)' : 'var(--text-primary)' }}>
            {stats.accuracy}%
          </h2>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Avg Quiz Accuracy</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚</div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--cyan)' }}>{stats.totalTopics}</h2>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Topics Mastered</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Quizzes */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Recent Quiz Scores</h3>
          
          {history.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <div className="icon">📊</div>
              <h4>No quizzes taken yet</h4>
              <p>Generate some MCQs or Quizzes to see your score history here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {history.map((h, i) => {
                const pct = Math.round((h.score / h.total) * 100);
                let colorVar = 'var(--text-primary)';
                if (pct >= 80) colorVar = 'var(--green)';
                else if (pct < 60) colorVar = '#ef4444';
                else colorVar = 'var(--gold)';

                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{h.topic.length > 40 ? h.topic.substring(0, 40) + '...' : h.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="progress-bar" style={{ width: '100px', height: '6px', background: 'var(--bg-secondary)' }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: colorVar }}></div>
                      </div>
                      <div style={{ fontWeight: 700, color: colorVar, width: '40px', textAlign: 'right' }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Studied Topics */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Most Explored Topics</h3>
          
          {topics.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <div className="icon">🔍</div>
              <h4>No topics explored</h4>
              <p>Use the Topic Explorer to generate study packs.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {topics.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: (i === topics.length - 1) ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                      #{i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.subject || 'Custom Notes'} • Last studied {new Date(t.lastStudied).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-purple">{t.count} Sessions</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
