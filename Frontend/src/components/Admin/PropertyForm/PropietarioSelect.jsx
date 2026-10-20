import { useState, useRef, useEffect, useMemo } from 'react';

const etiquetaPropietario = (p) => {
    if (!p) return '';
    const nombre = p.tipo_persona === 'juridica'
        ? (p.razon_social || '')
        : `${p.nombre || ''} ${p.apellidos || ''}`.trim();
    return nombre || 'Sin nombre';
};

export default function PropietarioSelect({ propietarios = [], value, onChange, name = 'propietario_id' }) {
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [resaltado, setResaltado] = useState(0);
    const contenedorRef = useRef(null);
    const inputRef = useRef(null);

    const seleccionado = useMemo(
        () => propietarios.find((p) => String(p.id) === String(value)) || null,
        [propietarios, value]
    );

    useEffect(() => {
        if (seleccionado) {
            setBusqueda(etiquetaPropietario(seleccionado));
        } else {
            setBusqueda('');
        }
    }, [seleccionado]);

    useEffect(() => {
        const handleClickFuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
                setBusqueda(seleccionado ? etiquetaPropietario(seleccionado) : '');
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, [seleccionado]);

    const normalizar = (str) =>
        String(str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const filtrados = useMemo(() => {
        const q = normalizar(busqueda).trim();
        if (!q) return propietarios.slice(0, 50);

        const soloDigitos = q.replace(/\D/g, '');

        return propietarios.filter((p) => {
            const nombre = normalizar(etiquetaPropietario(p));
            const doc = normalizar(p.documento_identidad);
            const docDigitos = doc.replace(/\D/g, '');

            return (
                nombre.includes(q) ||
                doc.includes(q) ||
                (soloDigitos.length > 0 && docDigitos.includes(soloDigitos))
            );
        }).slice(0, 50);
    }, [busqueda, propietarios]);

    useEffect(() => {
        setResaltado(0);
    }, [busqueda, abierto]);

    const emitir = (nuevoId) => {
        onChange({ target: { name, value: nuevoId === null ? '' : String(nuevoId) } });
    };

    const seleccionar = (p) => {
        emitir(p.id);
        setBusqueda(etiquetaPropietario(p));
        setAbierto(false);
        inputRef.current?.blur();
    };

    const limpiar = () => {
        emitir(null);
        setBusqueda('');
        setAbierto(false);
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        setAbierto(true);
        if (seleccionado) setBusqueda('');
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
        setAbierto(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setAbierto(true);
            setResaltado((prev) => Math.min(prev + 1, filtrados.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setResaltado((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (abierto && filtrados[resaltado]) {
                e.preventDefault();
                seleccionar(filtrados[resaltado]);
            }
        } else if (e.key === 'Escape') {
            setAbierto(false);
            setBusqueda(seleccionado ? etiquetaPropietario(seleccionado) : '');
        }
    };

    return (
        <div className="admin-autocomplete" ref={contenedorRef}>
            <div className="input-group">
                <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o cédula..."
                    value={busqueda}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {value ? (
                    <button
                        type="button"
                        className="admin-action-btn"
                        onClick={limpiar}
                        tabIndex={-1}
                        aria-label="Limpiar propietario"
                    >
                        ×
                    </button>
                ) : (
                    <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => { setAbierto((v) => !v); inputRef.current?.focus(); }}
                        tabIndex={-1}
                        aria-label="Mostrar opciones"
                    >
                        ▾
                    </button>
                )}
            </div>

            {abierto && (
                <div className="admin-autocomplete-menu">
                    {propietarios.length === 0 ? (
                        <div className="admin-autocomplete-empty">
                            No hay propietarios activos. Créalos en la pestaña &quot;Propietarios&quot;.
                        </div>
                    ) : filtrados.length === 0 ? (
                        <div className="admin-autocomplete-empty">
                            Sin resultados para «{busqueda}».
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                className={`admin-autocomplete-option${!value ? ' highlighted' : ''}`}
                                onClick={() => { emitir(null); setBusqueda(''); setAbierto(false); }}
                                onMouseEnter={() => setResaltado(-1)}
                            >
                                <strong>Sin asignar</strong>
                            </button>

                            {filtrados.map((p, idx) => {
                                const activo = resaltado === idx;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className={`admin-autocomplete-option${activo ? ' highlighted' : ''}`}
                                        onClick={() => seleccionar(p)}
                                        onMouseEnter={() => setResaltado(idx)}
                                    >
                                        <strong>{etiquetaPropietario(p)}</strong>
                                        <small>
                                            <span className="text-capitalize">
                                                {p.tipo_persona === 'juridica' ? 'Jurídica' : 'Física'}
                                            </span>
                                            <span>{p.documento_identidad || ''}</span>
                                        </small>
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            {seleccionado && !abierto && (
                <small className="admin-hint">
                    {seleccionado.tipo_persona === 'juridica' ? 'Jurídica' : 'Física'} · {seleccionado.documento_identidad}
                </small>
            )}
        </div>
    );
}