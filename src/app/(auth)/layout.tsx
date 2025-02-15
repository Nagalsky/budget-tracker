export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className='min-h-dvh bg-accent flex flex-col items-center justify-center py-8'>
			<section className='w-full'>
				<div className='container'>{children}</div>
			</section>
		</main>
	)
}
