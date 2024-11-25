// FavoritesModal.tsx
import React from 'react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal = ({ isOpen, onClose }: FavoritesModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Favorites</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>
        <div className="space-y-4">
          {/* Favorites content */}
        </div>
      </div>
    </div>
  );
};