type ButtonProps = {
  children?: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-blue-400 text-white rounded-xl px-4 py-2 text-xl hover:bg-blue-500 duration-300 flex">
      {children}
    </button>
  );
}
