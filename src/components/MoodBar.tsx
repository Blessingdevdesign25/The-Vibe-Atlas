import React from 'react';
import type { Mood } from '../types/index';
import '../styles/MoodBar.css';

interface MoodBarProps {
  onMoodSelect: (mood: Mood) => void;
  activeMood: Mood | null;
  isLoading: boolean;
}

const moods: Mood[] = ['calm', 'loud', 'warm', 'lonely', 'bright'];

const MoodBar: React.FC<MoodBarProps> = React.memo(({ onMoodSelect, activeMood, isLoading }) => {
  return (
    <div className="mood-bar-container" role="tablist" aria-label="Mood selection">
      <div className="mood-bar glass">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`mood-btn ${mood} ${activeMood === mood ? 'active' : ''}`}
            onClick={() => onMoodSelect(mood)}
            disabled={isLoading && activeMood === mood}
            role="tab"
            aria-selected={activeMood === mood}
            aria-label={`Select ${mood} mood`}
          >
            <span className="mood-dot" aria-hidden="true"></span>
            <span className="mood-label">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default MoodBar;
