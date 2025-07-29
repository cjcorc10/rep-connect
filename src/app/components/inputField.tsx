type InputFieldProps = {
  id: string;
};

export default function InputField({ id }: InputFieldProps) {
  return (
    <input
      type="text"
      id={id}
      name={id}
      className="outline-none text-gray-800 text-3xl"
      placeholder={`Enter your ${id}`}
      required
    />
  );
}
