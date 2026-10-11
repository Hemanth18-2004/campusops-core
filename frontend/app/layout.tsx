import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CampusOps",
  description: "Campus Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        {children}
      </body>
    </html>
  );
}