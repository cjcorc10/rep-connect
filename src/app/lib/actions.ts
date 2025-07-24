'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

// schema to validate zipcode in formdata
const FormSchema = z.object({
  zipcode: z.string().min(5).max(5),
});

// error returned if validation fails
export type State = {
  error?: string;
  message?: string;
};

// server action to fetch representatives based on zipcode
export const getReps = async (
  previousState: State,
  formData: FormData
) => {
  const validatedData = FormSchema.safeParse({
    zipcode: formData.get('zipcode'),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.message,
      message: 'Please enter a 5 digit zipcode.',
    };
  }

  const { zipcode } = validatedData.data;
  console.log('Fetching representatives for zipcode:', zipcode);

  redirect(`/reps/${zipcode}`);
};
