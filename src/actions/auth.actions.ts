"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpChildSchema,
  SignUpSchema,
} from "@/schemas/auth.schema";
import { UserRole } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import type { z } from "zod";

export async function register(data: z.infer<typeof SignUpSchema>) {
  try {
    const validatedFields = SignUpSchema.parse(data);
    if (!validatedFields) {
      return { error: "Invalid input data" };
    }

    const { name, email, password, passwordConfirmation } = validatedFields;

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await bcryptjs.hash(password, 10);

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: lowerCaseEmail,
      },
    });

    if (isUserExist) {
      return { error: "User already exists" };
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: lowerCaseEmail,
          name,
          password: hashedPassword,
          role: UserRole.parent,
        },
      });

      await tx.parent.create({
        data: {
          userId: user.id,
        },
      });
    });

    await signIn("credentials", {
      email: lowerCaseEmail,
      password,
      redirect: false,
    });

    return {
      redirect: {
        callbackUrl: "/",
      },
    };
  } catch {
    return { error: "An error occurred" };
  }
}

export async function login(data: z.infer<typeof SignInSchema>) {
  const validatedFields = SignInSchema.parse(data);
  if (!validatedFields) {
    return { error: "Invalid input data" };
  }

  const { email, password } = validatedFields;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!isUserExist || !isUserExist.password || !isUserExist.email) {
    return { error: "User not found" };
  }

  try {
    await signIn("credentials", {
      email: isUserExist.email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };

        default:
          return { error: "Please confirm your email address" };
      }
    }
    throw error;
  }

  return {
    success: "User logged in successfully!",
  };
}

export async function googleAuthenticate() {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Google login failed" };
    }
    throw error;
  }

  return {
    success: "User logged in successfully!",
  };
}

export async function forgotPassword(
  data: z.infer<typeof ForgotPasswordSchema>,
) {
  const validatedFields = ForgotPasswordSchema.parse(data);
  if (!validatedFields) {
    return { error: "Invalid input data" };
  }

  const { email } = validatedFields;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  const token = await bcryptjs.genSalt(16);
  const expires = new Date(Date.now() + 3600 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  const resetLink = `${process.env.AUTH_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM!,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  return { success: true };
}

export async function resetPassword(data: z.infer<typeof ResetPasswordSchema>) {
  const validatedFields = ResetPasswordSchema.parse(data);
  if (!validatedFields) {
    return { error: "Invalid input data" };
  }

  const { token, password } = validatedFields;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return { error: "Invalid or expired token" };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
  return { success: true, redirect: "/sign-in?reset=success" };
}

export async function registerChild(data: z.infer<typeof SignUpChildSchema>) {
  try {
    const validatedFields = SignUpChildSchema.parse(data);
    if (!validatedFields) {
      return { error: "Invalid input data" };
    }

    const { name, email, password, passwordConfirmation, parentId } =
      validatedFields;

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await bcryptjs.hash(password, 10);

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: lowerCaseEmail,
      },
    });

    if (isUserExist) {
      return { error: "User already exists" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: lowerCaseEmail,
          name,
          password: hashedPassword,
          role: UserRole.child,
          child: {
            create: {
              parentId: parentId,
            },
          },
        },
      });
    });

    return {
      success: true,
    };
  } catch {
    return { error: "An error occurred" };
  }
}
