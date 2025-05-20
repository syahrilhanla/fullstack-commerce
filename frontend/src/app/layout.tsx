"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClass = new QueryClient();

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers>
					<QueryClientProvider client={queryClass}>
						<div className="flex flex-col min-h-screen box-border">
							<NavbarComponent />
							<main className="flex flex-col items-center justify-start px-64">
								{children}
							</main>
						</div>
					</QueryClientProvider>
				</Providers>
			</body>
		</html>
	);
}
