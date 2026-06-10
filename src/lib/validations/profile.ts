import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().min(8, 'Nomor telepon tidak valid').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
