import mysql from 'mysql2/promise';
import 'dotenv/config';




const db = mysql.createPool({


    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000


});

async function probarConexion() {

    try {


        const connection = await db.getConnection();
        connection.release();


    } catch (error) {


        console.error(error.message);



    }
}


probarConexion();



export default db;