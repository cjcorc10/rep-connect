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
  const hasError = Boolean(state.message);

  return (
    <>
      <form
        action={formAction}
        className="
          w-full max-w-[720px] mx-auto
          bg-white/95 backdrop-blur
          rounded-xl shadow-md
          p-2
        "
      >
        <div className="flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
            <label htmlFor="zip" className="sr-only">
              ZIP code
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Enter your ZIP code"
              required
              aria-invalid={hasError}
              className="
                block w-full
                rounded-lg
                px-4 py-3
                text-base sm:text-lg
                bg-white text-gray-900 placeholder:text-gray-500
                outline-none
                ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600
              "
            />
          </div>

          <Button>
            <Search className="mr-2" />
            Search
          </Button>
        </div>
      </form>

      {hasError && (
        <div
          role="alert"
          className="mt-3 text-sm sm:text-base font-medium text-red-600"
        >
          {state.message}
        </div>
      )}
    </>
  );
}
