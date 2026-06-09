import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Alamat pengiriman minimal 10 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^\d+$/, 'Nomor telepon hanya boleh angka').optional().or(z.literal('')),
  paymentMethod: z.enum(['cash', 'transfer', 'e-wallet'] as const),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
