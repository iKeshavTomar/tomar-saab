
import React from 'react';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-center">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <span className="mr-3 text-sm font-medium text-gray-300">{label}</span>
        <div className="relative">
          <input
            id="toggle"
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={() => onChange(!enabled)}
          />
          <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-teal-500' : 'bg-gray-600'}`}></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              enabled ? 'transform translate-x-6' : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};
