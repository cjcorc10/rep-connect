type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({
  children,
}: MainContainerProps) {
  return (
    <main
      className="flex flex-col flex-1 md:m-2 rounded-2xl bg-gray-50 shadow-md  border-gray-100 overflow-hidden"
      // style={{
      //   backgroundImage:
      //     'radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 0)',
      //   backgroundSize: '20px 20px',
      //   backgroundRepeat: 'repeat',
      // }}
    >
      {children}
    </main>
  );
}
