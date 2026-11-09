import nodemailer from 'nodemailer';
import 'dotenv/config';

const port = Number(process.env.SMTP_PORT) || 2525;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

export default transporter;