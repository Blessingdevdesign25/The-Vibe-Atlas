import React, { useState } from 'react';
import type { VibeImage } from '../types/index';
import '../styles/ImageCard.css';

interface ImageCardProps {
  image: VibeImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`image-card glass ${loaded ? 'loaded' : ''}`}>
      <div className="image-wrapper">
        <img
          src={image.url}
          alt={image.alt}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
        <div className="image-overlay">
          <span className="mood-tag">{image.mood}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
