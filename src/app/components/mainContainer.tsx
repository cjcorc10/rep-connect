type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({
  children,
}: MainContainerProps) {
  return (
    <main
      className="relative flex flex-col flex-1 md:m-2 rounded-xl shadow-md  border-gray-100 overflow-hidden"
      style={{ backgroundColor: "#e9e9e9" }}
    >
      {children}
    </main>
  );
}
