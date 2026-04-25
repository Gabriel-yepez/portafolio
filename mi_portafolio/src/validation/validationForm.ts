import { z } from "zod";

export const contactFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "El nombre no puede estar vacío")
		.max(80, "El nombre es demasiado largo"),
	email: z.email("Ingresa un correo electrónico válido"),
	message: z
		.string()
		.trim()
		.min(1, "El mensaje no puede estar vacío")
		.max(1000, "El mensaje es demasiado largo"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export function validateContactForm(data: ContactFormData) {
	const result = contactFormSchema.safeParse(data);

	if (!result.success) {
		const fieldErrors = result.error.flatten().fieldErrors;

		const errors: ContactFormErrors = {
			name: fieldErrors.name?.[0],
			email: fieldErrors.email?.[0],
			message: fieldErrors.message?.[0],
		};

		return {
			isValid: false as const,
			errors,
		};
	}

	return {
		isValid: true as const,
		data: result.data,
		errors: {} as ContactFormErrors,
	};
}

