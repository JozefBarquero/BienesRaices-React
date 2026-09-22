export default function PropertyDescription({ description }) {


    if (!description) return null;



    return (

        <div className="mb-5">

            <h3 className="fw-bold mb-3">Descripción</h3>


            <p className="text-body-secondary fs-5" style={{ whiteSpace: 'pre-line' }}>
                {description}
            </p>


        </div>
    );

    
}