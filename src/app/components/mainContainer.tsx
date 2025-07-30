type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({
  children,
}: MainContainerProps) {
  return (
    <main
      className="flex flex-col flex-1 p-4 m-2 rounded-2xl bg-gray-50 shadow-md border border-gray-100"
      style={{
        backgroundImage:
          'radial-gradient(circle, gray 1px, transparent 0)',
        backgroundSize: '20px 20px',
        backgroundRepeat: 'repeat',
      }}
    >
      {children}
    </main>
  );
}
