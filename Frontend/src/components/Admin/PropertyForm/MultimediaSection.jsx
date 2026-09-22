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
    isNew



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

        <div className="mb-4">

            <h4 className="fw-bold text-primary mb-3">Multimedia</h4>

            <div className="mb-3">


                <label className="form-label fw-semibold">URL de Video (YouTube/Vimeo):</label>
               
                <input
                    type="text"
                    name="url_video"
                    value={formData.url_video || ''}
                    onChange={onChange}
                    className="form-control"
                />
            </div>


            <div className="mb-3">
                <label className="form-label fw-semibold">Imagen Principal:</label>
                
                
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="form-control"
                    required={isNew}
                />
                
                
                {previewUrl && (
                    <div className="mt-3" style={{ maxWidth: '300px' }}>
                        <img src={previewUrl} alt="Principal" className="img-thumbnail rounded shadow-sm w-100" />
                    </div>
                )}
            </div>



            <div>


                <label className="form-label fw-semibold">Imágenes Secundarias (Galería):</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onSecondaryFilesChange}
                    className="form-control"
                />


                {secondaryPreviewUrls.length > 0 && (


                    <div className="d-flex flex-wrap gap-3 mt-3">


                        {secondaryPreviewUrls.map((item, idx) => {

                            const url = typeof item === 'string' ? item : (item?.preview || item?.url);
                            return (

                                <div

                                    key={item?.id || idx}
                                    className="position-relative border rounded overflow-hidden bg-body-tertiary shadow-sm"
                                    style={{ width: '120px', height: '120px', cursor: 'grab' }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    
                                >
                                    <img

                                        src={url}
                                        alt={`Secundaria ${idx + 1}`}
                                        className="w-100 h-100 object-fit-cover"

                                    />
                                    <button

                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{ width: '24px', height: '24px', fontSize: '14px', lineHeight: 1 }}
                                        onClick={() => onRemoveSecondaryImage && onRemoveSecondaryImage(idx)}
                                        aria-label="Eliminar imagen"
                                    
                                    >
                                        &times;
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