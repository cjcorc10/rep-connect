type ButtonProps = {
  children?: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-accent text-white rounded-xl px-4 py-2 text-xl flex hover:bg-accent-dark hover:scale-105 focus:scale-105 active:scale-[1.02] transition">
      {children}
    </button>
  );
}
