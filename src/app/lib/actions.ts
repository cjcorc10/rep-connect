'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCoordinates } from './util';

const GeoSchema = z.object({
  status: z.string(),
  results: z
    .array(
      z.object({
        geometry: z.object({
          bounds: z.object({
            northeast: z.object({ lat: z.number(), lng: z.number() }),
            southwest: z.object({ lat: z.number(), lng: z.number() }),
          }),
        }),
      })
    )
    .default([]),
});

// error returned if validation fails
export type ErrorState = {
  error?: string;
  message?: string;
};

const StreetFormSchema = z.object({
  zip: z.string().min(5),
  street: z.string().min(1),
});

export const validateStreetAddress = async (
  previousState: ErrorState,
  formData: FormData
) => {
  const validatedData = StreetFormSchema.safeParse({
    street: formData.get('street'),
    zip: formData.get('zip'),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.message,
      message: 'Please enter a valid street address.',
    };
  }

  const { street, zip } = validatedData.data;

  // Here you would typically handle the street address logic
  // For now, we just log it and redirect to a placeholder
  redirect(`/reps/${zip}?street=${encodeURIComponent(street)}`);
};
