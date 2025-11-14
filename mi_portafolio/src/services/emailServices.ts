import emailjs from "@emailjs/browser";

export function sendEmail(
    form: HTMLFormElement,
    setIsSending: (sending: boolean) => void,
    setFormData: (data: { name: string; email: string; message: string }) => void
) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    setIsSending(true);

    const templateParams = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value ?? "",
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)?.value ?? "",
    };

    return new Promise<void>((resolve, reject) => {
      emailjs
        .send(serviceId as string, templateId as string, templateParams, publicKey as string | undefined)
        .then(
          () => {
            console.log("Email enviado correctamente via EmailJS");
            setFormData({ name: "", email: "", message: "" });
            resolve();
          },
          (err) => {
            console.error("Error enviando email via EmailJS:", err);
            reject(err);
          }
        )
        .finally(() => setIsSending(false));
    });

}