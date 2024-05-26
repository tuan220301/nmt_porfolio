import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Components/Navbar";
import RecoidContextProvider from "./Provider/recoilContextProvider";
import Provider from "./Provider/ThemeProvider";
import IntroUI from "./Components/IntroUI";
import PageTransitionEffect from "./Components/PageTransitionEffect";

export const metadata: Metadata = {
  title: "Tuan Porfolio",
  description: "Welcome to my portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-josefin flex flex-col bg-white dark:bg-[#202023] text-black dark:text-white items-center justify-center">
        <RecoidContextProvider>
          <Provider>
            <Navbar />
            <main className="flex min-h-screen w-full flex-col items-center p-4">
              <div className="mb-6">
                <IntroUI />
              </div>
              <PageTransitionEffect>
                {children}
              </PageTransitionEffect>
            </main>
          </Provider>
        </RecoidContextProvider>
      </body>
    </html>
  );
}

