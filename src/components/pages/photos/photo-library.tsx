'use client';
import { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

type Photo = {
  src: string;
  alt: string;
};

export default function PhotoLibrary({
  onClose,
  photos,
}: {
  onClose: () => void;
  photos: Photo[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPhoto, setExpandedPhoto] = useState<Photo | null>(null);
  const photosPerPage = 6;

  const totalPages = Math.ceil(photos.length / photosPerPage);
  const indexOfLast = currentPage * photosPerPage;
  const indexOfFirst = indexOfLast - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Expanded view
  if (expandedPhoto) {
    return (
      <div className="flex flex-col h-full w-full p-4 bg-[url('/assets/zig-zag.svg')]">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold text-green-900">Photo</h1>
          <Button onClick={() => setExpandedPhoto(null)} className="py-2 px-4">
            Back to Library
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto gap-4">
            <Card className="p-4 bg-lime-100 border-green-700 shadow-md max-w-md w-full flex flex-col items-center">
                <div className="relative w-[300px] h-[300px]">
                <Image
                    src={expandedPhoto.src}
                    alt={expandedPhoto.alt}
                    fill
                    className="object-contain rounded-md"
                />
                </div>
                <p className="text-green-900 text-center mt-4">{expandedPhoto.alt}</p>
            </Card>
        </div>
        <div className="text-center text-green-900 text-sm mt-2">
          &copy; 2025 Alfie Rayner
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-4 bg-[url('/assets/zig-zag.svg')]">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold text-green-900">Photo Library</h1>
        <Button onClick={onClose} className="py-1 px-3 w-auto">
            Back
        </Button>
    </div>


      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {currentPhotos.map((photo, index) => (
            <Card
              key={index}
              className="p-2 flex flex-col items-center bg-lime-100 border-green-700 shadow-md cursor-pointer"
              onClick={() => setExpandedPhoto(photo)}
            >
              <div className="w-full aspect-square relative">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <p className="text-green-900 text-sm mt-2 text-center">{photo.alt}</p>
            </Card>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
            <Button
            onClick={handlePrev}
            className="py-1 px-3 w-auto"
            disabled={currentPage === 1}
            >
            Previous
            </Button>
            <p className="text-green-900 self-center">
            Page {currentPage} of {totalPages}
            </p>
            <Button
            onClick={handleNext}
            className="py-1 px-3 w-auto"
            disabled={currentPage === totalPages}
            >
            Next
            </Button>
        </div>
        )}


      <div className="text-center text-green-900 text-sm mt-2">
        &copy; 2025 Alfie Rayner
      </div>
    </div>
  );
}
