'use client';
import React, { useActionState } from 'react';
import Button from './button';
import { Search } from 'lucide-react';
import { ErrorState, validateAddress } from '../lib/actions';

const initialState: ErrorState = {
  message: undefined,
  error: undefined,
};

export default function SearchForm() {
  const [state, formAction] = useActionState(
    validateAddress,
    initialState
  );

  return (
    <>
      <form
        action={formAction}
        className="flex bg-gray-100 rounded-2xl shadow-md px-4 py-2 z-10 relative"
      >
        <input
          type="text"
          id="zip"
          name="zip"
          className="outline-none text-gray-800 text-xl"
          placeholder="enter your zipcode"
          required
        />
        <Button>
          <Search className="mr-2" />
          search for reps
        </Button>
      </form>
      {state.message && (
        <div className="mt-4 font-bold text-red-600">
          {state.message}
        </div>
      )}
    </>
  );
}
