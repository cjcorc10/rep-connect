'use client';
import React, { useActionState } from 'react';
import Button from './button';
import { Search } from 'lucide-react';
import { getReps, State } from '../lib/actions';

const initialState: State = {
  message: undefined,
  error: undefined,
};
export default function SearchForm() {
  // manage the state of the form with useActionState and server action
  const [state, formAction] = useActionState(getReps, initialState);

  return (
    <>
      <form
        action={formAction}
        className="flex bg-white rounded-2xl shadow-md px-4 py-2"
      >
        <input
          type="text"
          id="zipcode"
          name="zipcode"
          className="outline-none text-gray-800 text-3xl"
          placeholder="enter your zipcode"
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
