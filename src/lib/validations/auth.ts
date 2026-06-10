import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, 'Password minimal 6 karakter')
  .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
  .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
  .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
  .regex(/[!@#$%^&*()\-_=+\[\]{}|;:,.<>?\/\\'"~`]/, 'Password harus mengandung minimal 1 karakter spesial (!@#$%^&* dll)');

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^\d+$/, 'Nomor telepon hanya boleh angka'),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
