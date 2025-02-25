import Sidebar from "@/app/components/sidebar";
import { Providers } from "@/app/providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white min-h-screen w-full">
      <Sidebar />
      <div className="w-full"><Providers >{children}</Providers></div>
    </div>
  );
}