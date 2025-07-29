type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({ children }: MainContainerProps) {
  return (
    <main className="flex flex-col p-4 flex-1  m-2 rounded-2xl bg-[url('images/dots.jpg')] bg-cover bg-center">
      {children}
    </main>
  );
}
