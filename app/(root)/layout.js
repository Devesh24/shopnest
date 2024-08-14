import Footer from "@/components/shared/Footer";

export default function RootLayout({children}) {
    return (
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
}