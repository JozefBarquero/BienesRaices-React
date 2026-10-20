import React from 'react';

export default function MultimediaSection({
    formData,
    previewUrl,
    secondaryPreviewUrls = [],
    onChange,
    onFileChange,
    onSecondaryFilesChange,
    onRemoveSecondaryImage,
    onReorderSecondaryImages,
    isNew,
}) {
    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (isNaN(fromIndex) || fromIndex === dropIndex) return;

        if (onReorderSecondaryImages) {
            onReorderSecondaryImages(fromIndex, dropIndex);
        }
    };

    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Multimedia</h4>

            <div className="mb-3">
                <label className="form-label" htmlFor="pf-video">URL de Video (YouTube/Vimeo)</label>
                <input
                    id="pf-video"
                    type="text"
                    name="url_video"
                    value={formData.url_video || ''}
                    onChange={onChange}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="pf-img-principal">Imagen Principal</label>
                <input
                    id="pf-img-principal"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="form-control"
                    required={isNew}
                />

                {previewUrl && (
                    <div className="admin-media-preview">
                        <img src={previewUrl} alt="Principal" />
                    </div>
                )}
            </div>

            <div>
                <label className="form-label" htmlFor="pf-img-secundarias">Imágenes Secundarias (Galería)</label>
                <input
                    id="pf-img-secundarias"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onSecondaryFilesChange}
                    className="form-control"
                />

                {secondaryPreviewUrls.length > 0 && (
                    <div className="admin-media-grid">
                        {secondaryPreviewUrls.map((item, idx) => {
                            const url = typeof item === 'string' ? item : (item?.preview || item?.url);
                            return (
                                <div
                                    key={item?.id || idx}
                                    className="admin-media-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                >
                                    <img src={url} alt={`Secundaria ${idx + 1}`} />
                                    <button
                                        type="button"
                                        className="admin-media-remove"
                                        onClick={() => onRemoveSecondaryImage && onRemoveSecondaryImage(idx)}
                                        aria-label="Eliminar imagen"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}