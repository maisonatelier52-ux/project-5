import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";


export const metadata = {
  title: "NEXUS — News. Context. Clarity.",
  description:
    "NEXUS delivers global news, technology, science, business, culture, and in-depth explainers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}