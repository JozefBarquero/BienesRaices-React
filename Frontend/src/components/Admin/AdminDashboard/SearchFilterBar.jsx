export default function SearchFilterBar({
    search,
    onSearchChange,
    placeholder = 'Buscar...',
    filter,
    onFilterChange,
    filterOptions
}) {
    return (
        <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <div className="input-group flex-grow-1">
                <span className="input-group-text bg-body text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {search && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onSearchChange('')}
                        aria-label="Limpiar búsqueda"
                    >
                        &times;
                    </button>
                )}
            </div>

            {filterOptions && (
                <select
                    className="form-select"
                    style={{ maxWidth: '220px' }}
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}
        </div>
    );
}