export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ContactFormErrors;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) {
    errors.name = "El nombre es requerido.";
  } else if (data.name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  }

  if (!data.email.trim()) {
    errors.email = "El email es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "El email no es válido.";
  }

  if (!data.message.trim()) {
    errors.message = "El mensaje es requerido.";
  } else if (data.message.trim().length < 10) {
    errors.message = "El mensaje debe tener al menos 10 caracteres.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
