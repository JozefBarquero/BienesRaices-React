import { useState } from 'react';
import { api } from '@/services/api';



export default function PropertyContactForm({ propertyId, propertyTitle }) {


    const [form, setForm] = useState({

        nombre: '',
        correo: '',
        telefono_cliente: '',
        mensaje: ''
    });


    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {


        e.preventDefault();
        setStatus('Enviando...');

        try {

            await api.contacto.enviar({
                ...form,
                propiedad_id: propertyId,
                propiedad_titulo: propertyTitle,
                tipo_consulta: 'propiedad'
            });

            setStatus('Mensaje enviado con éxito');
            setForm({ nombre: '', correo: '', telefono_cliente: '', mensaje: '' });
        } catch (err) {

            setStatus('Error al enviar el mensaje.');

        }

    };






    return (


        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">


            <h3 className="fw-bold mb-4">
                ¿Te interesa esta propiedad? Con gusto te atenderemos.
            </h3>

            <form onSubmit={handleSubmit}>

                <div className="row g-3">

                    <div className="col-12">

                        <input
                            type="text"
                            placeholder="Tu Nombre Completo"
                            required
                            className="form-control form-control-lg"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        />

                    </div>

                    <div className="col-md-6">

                        <input
                            type="email"
                            placeholder="Tu Correo Electrónico"
                            required
                            className="form-control form-control-lg"
                            value={form.correo}
                            onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        />

                    </div>


                    <div className="col-md-6">

                        <input
                            type="text"
                            placeholder="Tu Teléfono (Opcional)"
                            className="form-control form-control-lg"
                            value={form.telefono_cliente}
                            onChange={(e) =>
                                setForm({ ...form, telefono_cliente: e.target.value })
                            }
                        />

                    </div>


                    <div className="col-12">


                        <textarea
                            placeholder="Mensaje o consulta adicional"
                            required
                            rows="4"
                            className="form-control form-control-lg"
                            value={form.mensaje}
                            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                        ></textarea>


                    </div>


                    <div className="col-12">

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
                        >
                            Enviar Consulta al Asesor
                        </button>


                    </div>


                </div>


                {status && (

                    <div className="alert alert-info text-center mt-4 mb-0" role="alert">
                        {status}
                    </div>

                )}

                
            </form>
        </div>
    );
}