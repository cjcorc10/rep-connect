type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({
  children,
}: MainContainerProps) {
  return (
    <main className="flex flex-col p-4 flex-1 border border-gray-200 m-2 rounded-2xl bg-gray-50">
      {children}
    </main>
  );
}
