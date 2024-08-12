import Header from "@/components/shared/Header";

export default function RootLayout({children}) {
    return (
      <div className="flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
      </div>
    );
}