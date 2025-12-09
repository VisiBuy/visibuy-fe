import { z } from "zod";

export const createVerificationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  enableEscrow: z.boolean(),
  photos: z
    .array(z.instanceof(File))
    .length(5, "You must upload exactly 5 photos")
    .refine((files) => files.every((file) => file instanceof File), {
      message: "Invalid file",
    }),
  video: z.instanceof(File, {
    message: "Video is required",
  }),
});

export type CreateVerificationFormData = z.infer<
  typeof createVerificationSchema
>;
