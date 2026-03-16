'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    difficulty: 'Medium',
    apiKey: ''
  });

  useEffect(() => {
    // Load setting overrides from local storage
    const saved = localStorage.getItem('studyhero_settings');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('studyhero_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all your study data, streaks, and scores? This cannot be undone.')) {
      localStorage.removeItem('studyhero_stats');
      localStorage.removeItem('studyhero_quizzes');
      localStorage.removeItem('studyhero_topics');
      toast.success('All study data cleared.');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1>Settings ⚙️</h1>
        <p>Manage your account preferences and global default settings.</p>
      </div>

      <div className="grid-1" style={{ gap: '2rem' }}>
        
        {/* Appearance */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Appearance & Behavior</h3>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Theme</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently locked to Dark Mode for MVP</span>
            </label>
            <select 
              className="select" 
              value={settings.theme} 
              onChange={(e) => setSettings({...settings, theme: e.target.value})}
              disabled
            >
              <option value="dark">Deep Space (Dark)</option>
              <option value="light">Paper (Light)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Daily Reminders</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get notified to keep your streak alive</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notifications} 
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }}
              />
            </label>
          </div>
        </div>

        {/* Defaults */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Generation Defaults</h3>
          
          <div className="form-group">
            <label className="input-label">Default Quiz Difficulty</label>
            <select 
              className="select" 
              value={settings.difficulty} 
              onChange={(e) => setSettings({...settings, difficulty: e.target.value})}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: '#ef4444' }}>Danger Zone</h3>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Clearing your data will permanently delete all your tracking statistics, quiz history, and mastered topics from this browser.
          </p>
          <button className="btn btn-ghost" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={clearData}>
            🗑️ Clear All Study Data
          </button>
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={saveSettings}>
          Save Settings
        </button>

      </div>
    </div>
  );
}
