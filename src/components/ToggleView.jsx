import React from 'react';
import { Grid, List } from 'lucide-react';

export const ToggleView = ({ viewMode, onToggle }) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onToggle('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid'
            ? 'bg-[#255F38] text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Grid view"
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => onToggle('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-[#255F38] text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
    </div>
  );
};
