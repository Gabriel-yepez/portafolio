type SetIsSending = (value: boolean) => void;
type SetFormData = (value: { name: string; email: string; message: string }) => void;

/**
 * Sends the contact form data.
 * Currently simulates a successful send. To enable real email sending,
 * install @emailjs/browser and configure VITE_EMAILJS_SERVICE_ID,
 * VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.
 */
export async function sendEmail(
  _form: HTMLFormElement,
  setIsSending: SetIsSending,
  setFormData: SetFormData,
): Promise<void> {
  setIsSending(true);
  try {
    // Simulated network delay — replace with real EmailJS call when keys are ready
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setFormData({ name: "", email: "", message: "" });
  } finally {
    setIsSending(false);
  }
}
