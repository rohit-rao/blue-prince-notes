
import React, { useState, useRef, useEffect } from 'react';

interface AutoCompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  onSuggestionClick,
  ...rest
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions =
    value && typeof value === 'string'
      ? suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion.toLowerCase() !== value.toLowerCase()
        )
      : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        className="bg-slate-800 border border-cyan-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
        {...rest}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-slate-800 border border-cyan-700 rounded-b-md max-h-48 overflow-y-auto mt-1">
          {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
            <li
              key={index}
              className="p-2 text-white hover:bg-cyan-800 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
