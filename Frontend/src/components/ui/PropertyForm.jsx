import React from 'react';
import usePropertyForm from '@/pages/Admin/usePropertyForm';
import StatusSection from '@/components/Admin/PropertyForm/StatusSection';
import BasicInfoSection from '@/components/Admin/PropertyForm/BasicInfoSection';
import PricingSection from '@/components/Admin/PropertyForm/PricingSection';
import LocationSection from '@/components/Admin/PropertyForm/LocationSection';
import FeaturesSection from '@/components/Admin/PropertyForm/FeaturesSection';
import DescriptionsSection from '@/components/Admin/PropertyForm/DescriptionsSection';
import MultimediaSection from '@/components/Admin/PropertyForm/MultimediaSection';




export default function PropertyForm({ initialData, onSubmit, onCancel }) {


    const {


        formData,
        provincias,
        cantones,
        distritos,
        tiposInmueble,
        previewUrl,
        secondaryPreviewUrls,
        handleChange,
        handleLocationSelect,
        handleCheckboxChange,
        handleFileChange,
        handleSecondaryFilesChange,
        handleRemoveSecondaryImage,
        handleReorderSecondaryImages,
        handleSubmit
    } = usePropertyForm(initialData, onSubmit);



    return (


        <form onSubmit={handleSubmit}>


            <StatusSection formData={formData} onChange={handleCheckboxChange} />
            <BasicInfoSection formData={formData} tipos={tiposInmueble} onChange={handleChange} />
            <PricingSection formData={formData} onChange={handleChange} />
            
            
            <LocationSection
                formData={formData}
                provincias={provincias}
                cantones={cantones}
                distritos={distritos}
                onChange={handleChange}
                onLocationSelect={handleLocationSelect}
            />


            <FeaturesSection formData={formData} onChange={handleChange} />
            <DescriptionsSection formData={formData} onChange={handleChange} />
            
            
            <MultimediaSection
                formData={formData}
                previewUrl={previewUrl}
                secondaryPreviewUrls={secondaryPreviewUrls}
                onChange={handleChange}
                onFileChange={handleFileChange}
                onSecondaryFilesChange={handleSecondaryFilesChange}
                onRemoveSecondaryImage={handleRemoveSecondaryImage}
                onReorderSecondaryImages={handleReorderSecondaryImages}
                isNew={!initialData}
            />



            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                <button type="button" onClick={onCancel} className="btn btn-secondary px-4">
                    Cancelar
                </button>
                
                <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Guardar Propiedad
                </button>

            </div>


        </form>


    );
}