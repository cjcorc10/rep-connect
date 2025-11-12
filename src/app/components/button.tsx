type ButtonProps = {
  children?: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-blue-500 text-white rounded-xl px-4 py-2 text-xl flex active:bg-blue-600 active:scale-95 transition-transform duration-200 ease-out justify-center items-center cursor-pointer">
      {children}
    </button>
  );
}
