type ContainerProps = {
  children: React.ReactNode;
};
export default function Container({ children }: ContainerProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden" style={{ backgroundColor: "#e9e9e9" }}>{children}</div>
  );
}
