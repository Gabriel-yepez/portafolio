import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { sendEmail } from "../services/emailServices";
import { type ContactFormErrors, validateContactForm } from "../validation/validationForm";
import { useContact } from "../hooks/useContact";
import { ICON_MAP } from "../lib/icons";
import { MotionSection } from "./ui/MotionSection";

export function Contact() {
  const { data, isError } = useContact();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    const result = validateContactForm(formData);
    if (!result.isValid) {
      setFormErrors(result.errors);
      setErrorMessage("Por favor corrige los errores del formulario.");
      return;
    }
    setFormErrors({});
    sendEmail(e.currentTarget, setIsSending, setFormData)
      .then(() => setSuccessMessage("Mensaje enviado correctamente. Gracias!"))
      .catch((err: unknown) => {
        setErrorMessage("Error enviando el mensaje. Intenta nuevamente más tarde.");
        console.error(err);
      });
  };

  if (isError || !data) return null;

  return (
    <MotionSection id="contact" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.description}</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Información de contacto</h3>
              <p className="text-sm text-muted-foreground">
                No dudes en contactarme a través de cualquiera de estos medios.
                Respondo lo más rápido posible.
              </p>
            </div>
            <div className="space-y-3">
              {data.infoItems.map((item, index) => {
                const Icon = ICON_MAP[item.iconName];
                return (
                  <Card key={index}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{item.title}</p>
                          {item.link ? (
                            <a href={item.link} className="text-sm text-foreground hover:text-accent transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }));
                      if (formErrors.name) setFormErrors((p: ContactFormErrors) => ({ ...p, name: undefined }));
                    }}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      if (formErrors.email) setFormErrors((p: ContactFormErrors) => ({ ...p, email: undefined }));
                    }}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, message: e.target.value }));
                      if (formErrors.message) setFormErrors((p: ContactFormErrors) => ({ ...p, message: undefined }));
                    }}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isSending}
                  className="w-full rounded-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>

              {successMessage && (
                <div className="mt-4 rounded-xl bg-green-900/20 border border-green-500/30 p-3 text-green-400 text-sm">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-4 rounded-xl bg-red-900/20 border border-red-500/30 p-3 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MotionSection>
  );
}
