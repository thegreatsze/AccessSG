'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchResultItem } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  id?: string;
  placeholder?: string;
  onSelect: (result: SearchResultItem) => void;
  'aria-label'?: string;
}

export default function SearchInput({ id, placeholder, onSelect, 'aria-label': ariaLabel }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the last-selected query string so the useEffect skips re-searching it
  const justSelectedRef = useRef<string | null>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (query.length < 3) { setResults([]); setOpen(false); return; }
    // Skip search when query was just set by a selection (not user typing)
    if (justSelectedRef.current === query) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    const address = item.ADDRESS || item.SEARCHVAL;
    justSelectedRef.current = address;
    setQuery(address);
    setResults([]);
    setOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" aria-hidden="true" />}
        <input
          id={id}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          className="w-full pl-9 pr-9 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          autoComplete="off"
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {results.slice(0, 8).map((item, i) => (
            <li key={i} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 last:border-0"
              >
                <div className="font-medium text-gray-900 truncate">{item.BUILDING || item.SEARCHVAL}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{item.ADDRESS}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
