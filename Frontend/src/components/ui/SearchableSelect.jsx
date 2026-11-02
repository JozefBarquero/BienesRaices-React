import { useState, useEffect, useRef, useMemo } from 'react';

const normalizeText = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    getValue = (o) => o.id,
    getLabel = (o) => o.nombre,
    getSearchText = (o) => getLabel(o),
    placeholder = 'Buscar...',
    disabled = false,
    required = false,
    id,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);

    const selected = useMemo(
        () => options.find((o) => String(getValue(o)) === String(value)),
        [options, value, getValue]
    );

    const displayValue = selected ? getLabel(selected) : '';

    const filtered = useMemo(() => {
        if (!search.trim()) return options;
        const q = normalizeText(search);
        return options.filter((o) => normalizeText(getSearchText(o)).includes(q));
    }, [options, search, getSearchText]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [search, isOpen]);

    const handleSelect = (option) => {
        onChange(getValue(option));
        setIsOpen(false);
        setSearch('');
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            if (filtered[highlightedIndex]) {
                e.preventDefault();
                handleSelect(filtered[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearch('');
        }
    };

    const inputValue = isOpen ? (search || displayValue) : displayValue;

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <input
                id={id}
                type="text"
                className="form-control"
                value={inputValue}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => {
                    setIsOpen(true);
                    e.target.select();
                }}
                onClick={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                required={required && !value}
                autoComplete="off"
            />
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        background: 'var(--bs-body-bg, #fff)',
                        border: '1px solid var(--bs-border-color, #dee2e6)',
                        borderRadius: '0.5rem',
                        maxHeight: '240px',
                        overflowY: 'auto',
                        marginTop: '4px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div style={{ padding: '0.5rem 0.75rem', color: 'var(--bs-secondary-color, #6c757d)' }}>
                            Sin resultados
                        </div>
                    ) : (
                        filtered.map((option, idx) => (
                            <button
                                key={getValue(option)}
                                type="button"
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.5rem 0.75rem',
                                    border: 'none',
                                    background: idx === highlightedIndex
                                        ? 'var(--bs-primary-bg-subtle, #e7f1ff)'
                                        : 'transparent',
                                    cursor: 'pointer',
                                    color: 'inherit',
                                    fontSize: 'inherit',
                                }}
                            >
                                {getLabel(option)}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}