import { propiedades } from '@/data/propiedades';
import PropiedadCard from './PropiedadCard';

export default function Catalogo() {


    return (

        <section className="container py-5">


            <h2 className="display-6 fw-bold text-primary text-center mb-4">Nuestras Propiedades Destacadas</h2>


            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">


                {propiedades.map((prop) => (
                    <div className="col" key={prop.id}>
                        <PropiedadCard propiedad={prop} />
                    </div>
                ))}


            </div>


            
        </section>
    );
}