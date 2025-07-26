'use client';
import React, { useActionState } from 'react';
import Button from './button';
import { Search } from 'lucide-react';
import { validateAddress, State } from '../lib/actions';

const initialState: State = {
  message: undefined,
  error: undefined,
};

type SearchProps = {
  type: 'zip' | 'street';
};
export default function SearchForm({ type }: SearchProps) {
  const [state, formAction] = useActionState(
    validateAddress,
    initialState
  );

  return (
    <>
      <form
        action={formAction}
        className="flex bg-white rounded-2xl shadow-md px-4 py-2"
      >
        <input type="hidden" name="type" value={type} />
        <input
          type="text"
          id="address"
          name="address"
          className="outline-none text-gray-800 text-3xl"
          placeholder={
            type === 'zip'
              ? 'enter your zipcode'
              : 'enter your street name'
          }
          required
        />
        <Button>
          <Search className="mr-2" />
          search for reps
        </Button>
      </form>
      {state.message && (
        <div className="mt-4 text-red-600">{state.message}</div>
      )}
    </>
  );
}
