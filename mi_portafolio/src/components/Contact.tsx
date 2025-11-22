import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { contactInfo } from "../util/contactInfo";
import { Send } from "lucide-react";
import { sendEmail } from "../services/emailServices";
import {
  type ContactFormErrors,
  validateContactForm,
} from "../validation/validationForm";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    const validationResult = validateContactForm(formData);

    if (!validationResult.isValid) {
      setFormErrors(validationResult.errors);
      setErrorMessage("Por favor corrige los errores del formulario.");
      return;
    }

    setFormErrors({});

    sendEmail(e.currentTarget, setIsSending, setFormData)
      .then(() => {
        setSuccessMessage("Mensaje enviado correctamente. Gracias!");
      })
      .catch((err) => {
        setErrorMessage("Error enviando el mensaje. Intenta nuevamente más tarde.");
        console.error(err);
      });
  };



  return (
    <section id="contact" className="py-10 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Contacto</h2>
          <p className="text-lg text-muted-foreground">
            ¿Tienes un proyecto en mente? ¡Hablemos!
          </p>
        </section>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <section>
              <h3 className="mb-4 text-center">Información de contacto</h3>
              <p className="text-muted-foreground mb-6">
                No dudes en contactarme a través de cualquiera de estos medios.
                Respondo lo más rápido posible.
              </p>
            </section>

            <section className="space-y-4">
              {contactInfo.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <picture className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </picture>
                      <article>
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p>{item.value}</p>
                        )}
                      </article>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, name: value }));
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, email: value }));
                      if (formErrors.email) {
                        setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, message: value }));
                      if (formErrors.message) {
                        setFormErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full cursor-pointer hover:bg-switch-background"
                  >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
              {successMessage && (
                <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-green-800">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-800">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}