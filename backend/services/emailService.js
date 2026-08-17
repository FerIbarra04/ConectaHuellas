const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCorreoRechazo({
  destinatario,
  nombreSolicitante,
  folio,
  nombreAnimal,
  motivo,
}) {
  try {
    const respuesta = await resend.emails.send({
      from: "Conecta Huellas <onboarding@resend.dev>",
      to: destinatario,
      subject: "Actualización de tu solicitud de incorporación",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">
          
          <div style="background:#2F6FED; padding:20px; text-align:center;">
            <h2 style="color:white; margin:0;">Conecta Huellas</h2>
            <p style="color:white; margin-top:8px;">
              Coordinación de Medio Ambiente y Protección Animal
            </p>
          </div>

          <div style="padding:30px; color:#333;">
            <p>Hola <strong>${nombreSolicitante}</strong>,</p>

            <p>
              Hemos revisado tu solicitud de incorporación de animal.
            </p>

            <p><strong>Folio:</strong> ${folio}</p>
            <p><strong>Animal:</strong> ${nombreAnimal}</p>

            <div style="margin:25px 0; padding:15px; background:#FEE2E2; border-left:5px solid #DC2626;">
              <strong>Motivo del rechazo:</strong><br><br>
              ${motivo}
            </div>

            <p>
              Si lo deseas, puedes realizar una nueva solicitud corrigiendo la información indicada anteriormente.
            </p>

            <p>
              Gracias por apoyar la adopción responsable.
            </p>
          </div>

          <div style="background:#F3F4F6; padding:15px; text-align:center; font-size:13px; color:#666;">
            Conecta Huellas · Coordinación de Medio Ambiente y Protección Animal
          </div>

        </div>
      `,
    });

    return respuesta;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
}

module.exports = {
  enviarCorreoRechazo,
};
