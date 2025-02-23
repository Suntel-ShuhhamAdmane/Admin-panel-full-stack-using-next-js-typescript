import Sidebar from "../components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white min-h-screen w-full">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}
