import 'dotenv/config';

const COMPANY_NAME = process.env.COMPANY_NAME || 'Bienes Raíces';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'San José, Costa Rica';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+506 8888-8888';
const COMPANY_EMAIL = process.env.EMAIL_FROM || 'contacto@bienesraices.com';
const PRIVACY_URL = process.env.PRIVACY_URL || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacidad`;
const TERMS_URL = process.env.TERMS_URL || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/terminos`;
const LOGO_URL = process.env.EMAIL_LOGO_URL || `${process.env.BACKEND_URL || 'http://localhost:3001'}/uploads/icon.svg`;
const PRIMARY_COLOR = '#0f2c59';
const ACCENT_COLOR = '#c59b27';

const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const sanitizeHeader = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[\r\n]+/g, ' ').trim();
};

const bulletproofButton = (href, texto) => `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:24px auto;">
        <tr>
            <td align="center" bgcolor="${PRIMARY_COLOR}" style="border-radius:8px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                    href="${href}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="17%" stroke="f" fillcolor="${PRIMARY_COLOR}">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${texto}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;background-color:${PRIMARY_COLOR};letter-spacing:0.3px;">
                    ${texto}
                </a>
                <!--<![endif]-->
            </td>
        </tr>
    </table>
`;

const layout = (contenido) => `
<!DOCTYPE html>
<html lang="es" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${COMPANY_NAME}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        :root { color-scheme: light dark; }
        html, body { margin:0 auto !important; padding:0 !important; width:100% !important; }
        body { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
        img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
        a { color:${PRIMARY_COLOR}; }
        @media (prefers-color-scheme: dark) {
            .email-bg { background-color:#0f172a !important; }
            .email-card { background-color:#1e293b !important; }
            .email-text { color:#cbd5e1 !important; }
            .email-heading { color:#f8fafc !important; }
            .email-muted { color:#94a3b8 !important; }
            .email-divider { border-color:#334155 !important; }
            .email-info-block { background-color:#0f172a !important; border-color:#334155 !important; }
            .email-footer { background-color:#0f172a !important; border-color:#334155 !important; }
            .email-footer-text { color:#94a3b8 !important; }
            .email-footer-link { color:#3b82f6 !important; }
        }
        @media only screen and (max-width:600px) {
            .email-container { width:100% !important; }
            .email-padding { padding:24px 20px !important; }
            .email-title { font-size:22px !important; line-height:28px !important; }
            .email-stack { display:block !important; width:100% !important; }
        }
    </style>
</head>
<body class="email-bg" style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;" class="email-bg">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="email-container" style="width:600px;max-width:600px;">
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <img src="${LOGO_URL}" alt="${COMPANY_NAME}" width="72" height="72" style="display:block;width:72px;height:72px;">
                            <p style="margin:12px 0 0;font-size:13px;font-weight:700;color:${PRIMARY_COLOR};letter-spacing:2px;text-transform:uppercase;" class="email-heading">${COMPANY_NAME}</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="email-card" style="background-color:#ffffff;border-radius:16px;box-shadow:0 4px 12px rgba(15,44,89,0.08);overflow:hidden;">
                            ${contenido}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-footer">
                                <tr>
                                    <td align="center" style="padding:0 16px;">
                                        <p class="email-footer-text" style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;">${COMPANY_NAME}</p>
                                        <p class="email-footer-text" style="margin:0 0 4px;font-size:12px;color:#94a3b8;">${COMPANY_ADDRESS}</p>
                                        <p class="email-footer-text" style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Tel: ${COMPANY_PHONE} · ${COMPANY_EMAIL}</p>
                                        <p style="margin:0;font-size:12px;line-height:1.8;">
                                            <a href="${PRIVACY_URL}" class="email-footer-link" style="color:${PRIMARY_COLOR};text-decoration:underline;">Política de Privacidad</a>
                                            <span class="email-footer-text" style="color:#94a3b8;"> · </span>
                                            <a href="${TERMS_URL}" class="email-footer-link" style="color:${PRIMARY_COLOR};text-decoration:underline;">Términos y Condiciones</a>
                                        </p>
                                        <p class="email-footer-text" style="margin:16px 0 0;font-size:11px;color:#94a3b8;line-height:1.6;">
                                            Este correo fue enviado automáticamente. Por favor no responder directamente.<br>
                                            © ${new Date().getFullYear()} ${COMPANY_NAME}. Todos los derechos reservados.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const infoBlock = (label, value) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
            <td style="padding:10px 14px;background-color:#f8fafc;border-left:3px solid ${PRIMARY_COLOR};border-radius:0 6px 6px 0;" class="email-info-block">
                <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;" class="email-muted">${label}</p>
                <p style="margin:0;font-size:15px;color:#0f2c59;font-weight:600;word-break:break-word;" class="email-heading">${value}</p>
            </td>
        </tr>
    </table>
`;

export const emailLoginAlert = ({ nombre, fechaInicio, resetLink }) => ({
    subject: sanitizeHeader(`Alerta de seguridad · Inicio de sesión detectado`),
    html: layout(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="email-padding" style="padding:40px 40px 16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${ACCENT_COLOR};letter-spacing:2px;text-transform:uppercase;">Alerta de seguridad</p>
                    <h1 class="email-title" style="margin:0 0 16px;font-size:26px;line-height:32px;font-weight:800;color:#0f2c59;" class="email-heading">Inicio de sesión detectado</h1>
                    <p class="email-text" style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a5568;">Hola <strong>${escapeHtml(nombre)}</strong>,</p>
                    <p class="email-text" style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5568;">Se ha registrado un inicio de sesión exitoso en tu cuenta el <strong>${escapeHtml(fechaInicio)}</strong>.</p>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fef3c7;border-left:4px solid ${ACCENT_COLOR};border-radius:0 8px 8px 0;">
                        <tr>
                            <td style="padding:14px 16px;">
                                <p style="margin:0;font-size:13px;line-height:1.6;color:#78350f;">
                                    Si no reconoces esta actividad, cambia tu contraseña de inmediato y contacta al administrador del sistema.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 40px;">
                    ${bulletproofButton(resetLink, 'Cambiar mi contraseña')}
                    <p class="email-text email-muted" style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                        Si tú realizaste este inicio de sesión, puedes ignorar este mensaje de forma segura.
                    </p>
                </td>
            </tr>
        </table>
    `)
});

export const emailForgotPassword = ({ nombre, resetLink }) => ({
    subject: sanitizeHeader(`Recuperación de contraseña · ${COMPANY_NAME}`),
    html: layout(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="email-padding" style="padding:40px 40px 16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${ACCENT_COLOR};letter-spacing:2px;text-transform:uppercase;">Recuperación de acceso</p>
                    <h1 class="email-title" style="margin:0 0 16px;font-size:26px;line-height:32px;font-weight:800;color:#0f2c59;" class="email-heading">Hola ${escapeHtml(nombre)},</h1>
                    <p class="email-text" style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a5568;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                    <p class="email-text" style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5568;">Para establecer una nueva contraseña, haz clic en el siguiente botón:</p>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    ${bulletproofButton(resetLink, 'Establecer nueva contraseña')}
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e2e8f0;" class="email-divider">
                        <tr>
                            <td style="padding-top:20px;">
                                <p class="email-text email-muted" style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                                    Este enlace expirará en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura: tu contraseña actual permanecerá sin cambios.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `)
});

export const emailBienvenidaTrabajador = ({ nombre, apellidos, cedula, resetLink }) => ({
    subject: sanitizeHeader(`Bienvenido a ${COMPANY_NAME} · Activa tu cuenta`),
    html: layout(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="email-padding" style="padding:40px 40px 16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${ACCENT_COLOR};letter-spacing:2px;text-transform:uppercase;">Bienvenido al equipo</p>
                    <h1 class="email-title" style="margin:0 0 16px;font-size:26px;line-height:32px;font-weight:800;color:#0f2c59;" class="email-heading">Hola ${escapeHtml(nombre)} ${escapeHtml(apellidos)},</h1>
                    <p class="email-text" style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5568;">Tu cuenta ha sido creada exitosamente en el sistema de administración de <strong>${COMPANY_NAME}</strong>.</p>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    ${infoBlock('Usuario asignado', escapeHtml(cedula))}
                    ${infoBlock('Rol', 'Agente Inmobiliario')}
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    <p class="email-text" style="margin:0;font-size:15px;line-height:1.6;color:#4a5568;">Para activar tu cuenta y establecer tu contraseña personal, haz clic en el siguiente botón:</p>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 40px;">
                    ${bulletproofButton(resetLink, 'Activar mi cuenta')}
                    <p class="email-text email-muted" style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                        Por tu seguridad, te recomendamos establecer una contraseña única que no uses en otros servicios.
                    </p>
                </td>
            </tr>
        </table>
    `)
});

export const emailNuevoMensajePropiedad = ({
    trabajadorNombre,
    propiedadTitulo,
    propiedadId,
    clienteNombre,
    clienteEmail,
    clienteTelefono,
    mensaje,
    dashboardUrl
}) => ({
    subject: sanitizeHeader(`Nuevo contacto en: ${propiedadTitulo}`),
    html: layout(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="email-padding" style="padding:40px 40px 16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${ACCENT_COLOR};letter-spacing:2px;text-transform:uppercase;">Nuevo lead recibido</p>
                    <h1 class="email-title" style="margin:0 0 16px;font-size:26px;line-height:32px;font-weight:800;color:#0f2c59;" class="email-heading">Tienes una nueva consulta</h1>
                    <p class="email-text" style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a5568;">Hola <strong>${escapeHtml(trabajadorNombre)}</strong>,</p>
                    <p class="email-text" style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5568;">Un cliente potencial ha enviado una consulta desde la propiedad que publicaste:</p>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    ${infoBlock('Propiedad de interés', `${escapeHtml(propiedadTitulo)} <span style="color:#64748b;font-weight:400;font-size:13px;">(ID #${escapeHtml(propiedadId)})</span>`)}
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 8px;">
                    <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f2c59;" class="email-heading">Datos del cliente</h2>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    ${infoBlock('Nombre', escapeHtml(clienteNombre))}
                    ${infoBlock('Correo electrónico', `<a href="mailto:${escapeHtml(clienteEmail)}" style="color:${PRIMARY_COLOR};text-decoration:none;">${escapeHtml(clienteEmail)}</a>`)}
                    ${infoBlock('Teléfono', clienteTelefono ? escapeHtml(clienteTelefono) : '<em style="color:#94a3b8;font-weight:400;">No proporcionado</em>')}
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 8px;">
                    <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f2c59;" class="email-heading">Mensaje</h2>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td class="email-info-block" style="padding:16px 18px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                                <p class="email-text" style="margin:0;font-size:14px;line-height:1.7;color:#4a5568;white-space:pre-wrap;word-break:break-word;">${escapeHtml(mensaje)}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="email-padding" style="padding:0 40px 40px;">
                    <p class="email-text" style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#4a5568;">Gestiona esta consulta y da seguimiento al cliente desde el panel de administración:</p>
                    ${bulletproofButton(dashboardUrl, 'Ir al Panel de Administración')}
                </td>
            </tr>
        </table>
    `)
});