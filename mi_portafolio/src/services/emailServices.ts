const BASE = import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";

export async function sendEmail(
  form: HTMLFormElement,
  setIsSending: (sending: boolean) => void,
  setFormData: (data: { name: string; email: string; message: string }) => void,
): Promise<void> {
  const name = (form.elements.namedItem("name") as HTMLInputElement)?.value ?? "";
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "";
  const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value ?? "";

  setIsSending(true);
  try {
    const res = await fetch(`${BASE}/api/contact-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { name, email, message } }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
    }
    setFormData({ name: "", email: "", message: "" });
  } finally {
    setIsSending(false);
  }
}
