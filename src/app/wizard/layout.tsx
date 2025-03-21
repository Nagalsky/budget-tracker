export default function WizardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      {children}
    </main>
  );
}
