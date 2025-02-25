import { z } from "zod";

const getPasswordSchema = () =>
  z
    .string()
    .min(8, "Password must be atleast 8 characters")
    .max(32, "Password can not exceed 32 characters");

const getEmailSchema = () =>
  z.string().min(1, "Email is required").email("Invalid email");

const getNameSchema = () =>
  z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters");

export const SignUpSchema = z
  .object({
    name: getNameSchema(),
    email: getEmailSchema(),
    password: getPasswordSchema(),
    passwordConfirmation: getPasswordSchema(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const SignUpChildSchema = z
  .object({
    name: getNameSchema(),
    email: getEmailSchema(),
    password: getPasswordSchema(),
    parentId: getNameSchema(),
    passwordConfirmation: getPasswordSchema(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const SignInSchema = z.object({
  email: getEmailSchema(),
  password: z.string().min(1, "Please enter a valid password"),
});

export const ResetPasswordSchema = z
  .object({
    password: getPasswordSchema(),
    passwordConfirmation: getPasswordSchema(),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const ForgotPasswordSchema = z.object({
  email: getEmailSchema(),
});
