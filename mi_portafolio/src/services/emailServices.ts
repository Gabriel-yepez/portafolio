import emailjs from "@emailjs/browser";

export function sendEmail(
    form: HTMLFormElement, 
    setIsSending: (sending: boolean) => void, setFormData: (data: { name: string; email: string; message: string }) => void
) {

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "default_service";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_tmbrqih";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    setIsSending(true);

    const templateParams = {
      name: form.name,
      email: form.email,
      message: form.message,
    };

    emailjs
      .send(serviceId as string, templateId as string, templateParams, publicKey as string | undefined)
      .then(
        () => {
          alert("Mensaje enviado correctamente. Gracias!");
          setFormData({ name: "", email: "", message: "" });
        },
        (err) => {
          console.error("Error enviando email via EmailJS:", err);
          alert(JSON.stringify(err));
        }
      )
      .finally(() => setIsSending(false));


}