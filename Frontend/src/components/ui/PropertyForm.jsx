import usePropertyForm from '@/pages/Admin/usePropertyForm';
import StatusSection from '@/components/Admin/PropertyForm/StatusSection';
import BasicInfoSection from '@/components/Admin/PropertyForm/BasicInfoSection';
import PricingSection from '@/components/Admin/PropertyForm/PricingSection';
import LocationSection from '@/components/Admin/PropertyForm/LocationSection';
import FeaturesSection from '@/components/Admin/PropertyForm/FeaturesSection';
import DescriptionsSection from '@/components/Admin/PropertyForm/DescriptionsSection';
import MultimediaSection from '@/components/Admin/PropertyForm/MultimediaSection';
import { LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function PropertyForm({ initialData, onSubmit, onCancel }) {
    const {
        formData,
        provincias,
        cantones,
        distritos,
        tiposInmueble,
        propietarios,
        previewUrl,
        secondaryPreviewUrls,
        handleChange,
        handleLocationSelect,
        handleCheckboxChange,
        handleFileChange,
        handleSecondaryFilesChange,
        handleRemoveSecondaryImage,
        handleReorderSecondaryImages,
        handleSubmit,
    } = usePropertyForm(initialData, onSubmit);

    return (
        <form onSubmit={handleSubmit} className="lg-form">
            <StatusSection formData={formData} onChange={handleCheckboxChange} />

            <BasicInfoSection
                formData={formData}
                tipos={tiposInmueble}
                propietarios={propietarios}
                onChange={handleChange}
            />

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

            <div className="admin-form-actions">
                <LiquidGlassButton variant="ghost" onClick={onCancel}>
                    Cancelar
                </LiquidGlassButton>
                <LiquidGlassButton type="submit" variant="primary">
                    Guardar Propiedad
                </LiquidGlassButton>
            </div>
        </form>
    );
}
