type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({
  children,
}: MainContainerProps) {
  return (
    <main className="flex flex-col flex-1 md:m-2 rounded-2xl bg-gray-50 shadow-md border border-gray-100 ">
      {children}
    </main>
  );
}
