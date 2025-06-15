"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect } from "react";
import { getInitialCartItems, refreshAuthToken } from "@/helpers/dataQuery";
import { DataQueryEnum } from "@/enums/dataQuery.enum";
import { useRouter } from "next/navigation";

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
	const router = useRouter();

	const initiateUserSession = useCallback(async () => {
		const token = await refreshAuthToken();

		// if the refresh token is expired, show login modal
		if (token === DataQueryEnum.INVALID_REFRESH_TOKEN) {
			router.push("?login=true");
			return;
		}

		if (token) {
			await getInitialCartItems();
		} else {
			console.error("Failed to initiate user session");
		}
	}, [router]);

	useEffect(() => {
		// Initialize user session on first render
		initiateUserSession();
	}, []);

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers>
					<QueryClientProvider client={queryClass}>
						<Suspense>
							<div className="flex flex-col min-h-screen box-border">
								<NavbarComponent />
								<main className="flex flex-col items-center justify-start md:px-64 px-12">
									{children}
								</main>
							</div>
						</Suspense>
					</QueryClientProvider>
				</Providers>
			</body>
		</html>
	);
}
