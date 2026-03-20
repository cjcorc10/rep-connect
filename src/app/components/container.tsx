type ContainerProps = {
  children: React.ReactNode;
};
export default function Container({ children }: ContainerProps) {
  return (
    <div
      className="flex flex-col min-h-screen overflow-hidden"
      // style={{ backgroundColor: "#fffad1" }}
      style={{ backgroundColor: "#f3f0e0" }}
    >
      {children}
    </div>
  );
}
