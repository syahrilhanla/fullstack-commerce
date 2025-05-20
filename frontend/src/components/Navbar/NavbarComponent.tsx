import Link from "next/link";

import {
	Button,
	Divider,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import CartNavbarTrigger from "../Cart/CartNavbarTrigger";
import NavbarSearch from "./NavbarSearch";
import { Suspense, useState } from "react";
import LoginModal from "./LoginModal";

export const AcmeLogo = () => {
	return (
		<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
			<path
				clipRule="evenodd"
				d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
				fill="currentColor"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export default function NavbarComponent() {
	const [openLogin, setOpenLogin] = useState<"login" | "register" | null>(null);

	return (
		<Navbar maxWidth="full" className="bg-transparent shadow-sm">
			{openLogin && (
				<Suspense fallback={<div>Loading...</div>}>
					<LoginModal open={openLogin} onClose={() => setOpenLogin(null)} />
				</Suspense>
			)}

			<NavbarBrand>
				<Link href="/" className="flex items-center">
					<AcmeLogo />
					<p className="font-bold text-inherit">ACME</p>
				</Link>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<Suspense fallback={<div>Loading...</div>}>
					<NavbarSearch />
				</Suspense>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="flex gap-2 items-center">
					<CartNavbarTrigger />
					<Divider orientation="vertical" className="h-10 mr-1" />
					<Button
						variant="bordered"
						color="success"
						size="sm"
						onPress={() => setOpenLogin("login")}
						className="text-sm font-semibold text-success-600"
					>
						Login
					</Button>
					<Button
						variant="solid"
						color="success"
						size="sm"
						onPress={() => setOpenLogin("register")}
						className="text-sm font-semibold text-white"
					>
						Register
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
