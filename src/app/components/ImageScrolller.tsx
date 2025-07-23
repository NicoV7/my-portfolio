'use client';

import React, { useEffect, useState } from 'react';

interface ImageScrollerProps {
  cloudName: string;
  folder: string;
}

const ImageScroller: React.FC<ImageScrollerProps> = ({ cloudName, folder }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/cloudinary?folder=${folder}`);
        const data = await res.json();
        setImages(data.urls);
      } catch (err) {
        console.error('Failed to fetch Cloudinary images:', err);
      }
    };
    fetchImages();
  }, [folder]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <div className="animate-scroll-vertical h-[200%] w-full flex flex-col items-center gap-4 opacity-20">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            className="max-w-xs rounded-xl shadow-lg"
            alt={`project-${i}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageScroller;
