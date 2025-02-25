"use server";

import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { SendLocationSchema } from "@/schemas/location.schema";
import type { z } from "zod";

export async function sendLocationEmail(
  data: z.infer<typeof SendLocationSchema>,
) {
  try {
    const validatedFields = SendLocationSchema.parse(data);
    if (!validatedFields) {
      return { error: "Invalid input data" };
    }

    const { latitude, longitude, childId, parentEmail } = validatedFields;

    const location = await prisma.location.create({
      data: {
        latitude,
        longitude,
        childId,
      },
    });

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${location.longitude},${location.latitude}&z=14&l=map&size=600,300&markers=color:red%7C${location.latitude},${location.longitude}`;

    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM!,
      to: parentEmail,
      subject: "User Geolocation",
      html: `
        <p>Here is the user's location:</p>
        <p><a href="${mapsLink}" target="_blank">View on Google Maps</a></p>
        <img src="${mapUrl}" alt="Location Map" />
      `,
    });

    return location;
  } catch {
    return { error: "An error occurred" };
  }
}
