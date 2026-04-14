import InstallPWA from "@/components/install-pwa";
import { WeatherProvider } from "@/lib/weather-context";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// themeColor dipindah ke viewport (Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pekanbaru-weather.firmanps.my.id"),

  title: "Weather Classification System | Machine Learning Forecast",
  description:
    "Weather Classification System is a machine learning web application that classifies weather conditions using Random Forest algorithm based on meteorological data.",

  manifest: "/manifest.json",

  keywords: [
    "weather classification",
    "machine learning weather",
    "random forest weather classification",
    "weather forecasting system",
    "meteorological classification",
  ],

  authors: [{ name: "Firman PS" }],
  creator: "Firman PS",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Weather Classification System",
  },

  icons: {
    icon: "/img/favicon.ico",
    shortcut: "/img/favicon.ico",
    apple: "/img/apple-touch-icon.png",
  },

  openGraph: {
    title: "Weather Classification System",
    description:
      "Machine Learning based weather classification system using Random Forest algorithm.",
    url: "https://pekanbaru-weather.firmanps.my.id",
    siteName: "Weather Classification System",
    images: [
      {
        url: "/img/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Weather Classification Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <WeatherProvider>
          {children}
          <InstallPWA />
        </WeatherProvider>
      </body>
    </html>
  );
}