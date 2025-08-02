'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// schemea for validating zip code in form data
const FormSchema = z.object({
  zip: z.string().min(5),
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
  const validatedData = FormSchema.safeParse({
    zip: formData.get('zip'),
    street: formData.get('street'),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.message,
      message: 'Please enter a valid zip code.',
    };
  }

  const { zip } = validatedData.data;

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
