import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | E-Cell Eureka',
  description: 'E-Cell Eurekha Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* We are overriding the root layout's background color by setting it here.
          The root layout uses bg-background (#C2C1D2 by default). */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            background-color: #0A0A0A !important;
          }
        `
      }} />
      {children}
    </div>
  );
}
