'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCoordinates } from './util';

// schemea for validating zip code in form data
const FormSchema = z.object({
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/)
    .min(5),
});

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

// server action to fetch representatives based on zipcode
export const validateAddress = async (
  previousState: ErrorState,
  formData: FormData
) => {
  const parsedData = FormSchema.safeParse({
    zip: formData.get('zip'),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.message,
      message: 'Please enter a valid zip code.',
    };
  }

  const { zip } = parsedData.data;

  const raw = await getCoordinates(zip);
  const geoData = GeoSchema.safeParse(raw);
  const good =
    geoData.success &&
    geoData.data.status === 'OK' &&
    geoData.data.results.length > 0;

  if (!good) {
    return {
      message:
        'Unable to fetch location data. Please try a different zip code.',
    };
  }

  redirect(`/reps/${zip}`);
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
