import { z } from "zod";

// Newsletter validation
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Contact form validation
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^(\+92|0)?[0-9]{10,11}$/.test(val.replace(/\s/g, "")),
      "Please enter a valid phone number"
    ),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Checkout form validation
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine(
      (val) => /^(\+92|0)?[0-9]{10,11}$/.test(val.replace(/\s/g, "")),
      "Please enter a valid phone number"
    ),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  postalCode: z
    .string()
    .trim()
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Auth form validation
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
