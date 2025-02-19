import { z } from "zod";

const STRING_LIMITS = {
  NAME: { min: 3, max: 20 },
  ICON: { min: 1, max: 20 },
} as const;

const CATEGORY_TYPES = ["income", "expense"] as const;

const BaseCategorySchema = z.object({
  name: z.string().min(STRING_LIMITS.NAME.min).max(STRING_LIMITS.NAME.max),
  type: z.enum(CATEGORY_TYPES),
});

export const CreateCategorySchema = BaseCategorySchema.extend({
  icon: z.string().min(STRING_LIMITS.ICON.min).max(STRING_LIMITS.ICON.max),
});

export const DeleteCategorySchema = BaseCategorySchema;

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
