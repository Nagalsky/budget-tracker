import { z } from "zod";

const getEmailSchema = () =>
  z.string().min(1, "Email is required").email("Invalid email");

export const SendLocationSchema = z.object({
  latitude: z.coerce.number().min(1).default(0),
  longitude: z.coerce.number().min(1).default(0),
  parentEmail: getEmailSchema(),
  childId: z.string(),
});
