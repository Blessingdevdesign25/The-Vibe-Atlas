import React from 'react';
import { Mood } from '../types';
import '../styles/MoodBar.css';

interface MoodBarProps {
  onMoodSelect: (mood: Mood) => void;
  activeMood: Mood | null;
  isLoading: boolean;
}

const moods: Mood[] = ['calm', 'loud', 'warm', 'lonely', 'bright'];

const MoodBar: React.FC<MoodBarProps> = ({ onMoodSelect, activeMood, isLoading }) => {
  return (
    <div className="mood-bar-container">
      <div className="mood-bar glass">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`mood-btn ${mood} ${activeMood === mood ? 'active' : ''}`}
            onClick={() => onMoodSelect(mood)}
            disabled={isLoading && activeMood === mood}
          >
            <span className="mood-dot"></span>
            <span className="mood-label">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodBar;
