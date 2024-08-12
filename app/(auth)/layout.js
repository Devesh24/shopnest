export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex-center">
      <div className="flex-center w-[50%]">
        {children}
      </div>
    </div>
  );
}
