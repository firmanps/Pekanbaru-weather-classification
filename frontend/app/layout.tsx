import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weather.firmanps.com"),

  title: "Weather Prediction System | Machine Learning Forecast",
  description:
    "Weather Prediction System is a machine learning web application that predicts weather conditions using Random Forest algorithm based on meteorological data.",

  keywords: [
    "weather prediction",
    "machine learning weather",
    "random forest weather prediction",
    "weather forecasting system",
    "meteorological prediction",
  ],

  authors: [{ name: "Firman PS" }],

  creator: "Firman PS",

  icons: {
    icon: "/img/cloud-sun.png",
    shortcut: "/img/cloud-sun.png",
    apple: "/img/cloud-sun.png",
  },

  openGraph: {
    title: "Weather Prediction System",
    description:
      "Machine Learning based weather prediction system using Random Forest algorithm.",
    url: "https://weather.firmanps.com",
    siteName: "Weather Prediction System",
    images: [
      {
        url: "/img/cloud-sun.png",
        width: 512,
        height: 512,
        alt: "Weather Prediction Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "Weather Prediction System",
  //   description:
  //     "Machine Learning web application for predicting weather conditions.",
  //   images: ["/img/cloud-sun.png"],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
