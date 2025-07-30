'use client';
import { Search } from 'lucide-react';
import Button from './button';
import { useParams } from 'next/navigation';
import {
  ErrorState,
  validateAddress,
  validateStreetAddress,
} from '../lib/actions';
import { useActionState } from 'react';

const initialState: ErrorState = {
  error: undefined,
  message: undefined,
};

export default function StreetForm() {
  const { zip } = useParams();
  const [state, formAction] = useActionState(
    validateStreetAddress,
    initialState
  );

  return (
    <form
      action={formAction}
      className="flex bg-white rounded-2xl shadow-md px-4 py-2 mt-4"
    >
      <input type="hidden" name="zip" value={zip} />
      <input
        type="text"
        className="outline-none text-gray-800 text-xl w-100"
        placeholder="Enter your street address (e.g., 191 Main St)"
        name="street"
        required
      />
      <Button>
        <Search />
      </Button>
    </form>
  );
}
