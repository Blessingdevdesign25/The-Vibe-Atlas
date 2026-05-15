import React from 'react';
import type { VibeImage } from '../types/index';
import ImageCard from './ImageCard';
import SkeletonCard from './SkeletonCard';
import ErrorState from './ErrorState';
import '../styles/ImageGrid.css';

interface ImageGridProps {
  images: VibeImage[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, error, onRetry }) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div className="image-grid">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
        : images.map((image) => <ImageCard key={image.id} image={image} />)}
    </div>
  );
};

export default ImageGrid;
