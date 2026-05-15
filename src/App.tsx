import React, { useState, useEffect } from 'react';
import MoodBar from './components/MoodBar';
import ImageGrid from './components/ImageGrid';
import { useVibeImages } from './hooks/useVibeImages';
import type { Mood } from './types/index';
import './styles/global.css';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { images, loading, error, fetchImages } = useVibeImages();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    fetchImages(mood);
  };

  // Initial load with a random mood
  useEffect(() => {
    const moods: Mood[] = ['calm', 'loud', 'warm', 'lonely', 'bright'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    handleMoodSelect(randomMood);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">▲</div>
          <h1>The Vibe Atlas</h1>
        </div>
        <p className="app-tagline">One click. Five vibes. The web is your canvas.</p>
      </header>

      <main>
        <MoodBar
          onMoodSelect={handleMoodSelect}
          activeMood={selectedMood}
          isLoading={loading}
        />
        
        <ImageGrid
          images={images}
          isLoading={loading}
          error={error}
          onRetry={() => selectedMood && fetchImages(selectedMood)}
        />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} THE VIBE ATLAS &mdash; DESIGNED FOR CREATIVES</p>
      </footer>

      <style>{`
        .app-container {
          padding-top: 60px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-header {
          text-align: center;
          margin-bottom: 50px;
          padding: 0 20px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .logo-icon {
          font-size: 2rem;
          color: white;
          animation: pulse 4s infinite ease-in-out;
        }

        .app-header h1 {
          font-size: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: linear-gradient(to right, #fff, rgba(255,255,255,0.4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .app-tagline {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 300;
        }

        .app-footer {
          margin-top: auto;
          padding: 40px 20px;
          text-align: center;
          border-top: 1px solid var(--glass-border);
        }

        .app-footer p {
          color: var(--text-secondary);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .app-header h1 {
            font-size: 1.8rem;
          }
          .app-tagline {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
