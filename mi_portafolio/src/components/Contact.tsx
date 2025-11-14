import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { contactInfo } from "../util/contactInfo";
import { Send } from "lucide-react";
import { sendEmail } from "../services/emailServices";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendEmail(e.currentTarget, setIsSending, setFormData);
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
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
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}