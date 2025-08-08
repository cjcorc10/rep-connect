type ButtonProps = {
  children?: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-blue-500 text-white rounded-xl px-4 py-2 text-xl flex hover:bg-blue-700 hover:scale-105 focus:scale-105 active:scale-[1.02] transition justify-center items-center">
      {children}
    </button>
  );
}
