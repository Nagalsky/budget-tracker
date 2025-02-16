export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className='flex flex-col items-center justify-center min-h-dvh'>
			{children}
		</main>
	)
}
