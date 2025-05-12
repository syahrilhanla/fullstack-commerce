import Link from "next/link";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import CartNavbarTrigger from "./Cart/CartNavbarTrigger";
import NavbarSearch from "./NavbarSearch";

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
	return (
		<Navbar maxWidth="full" className="bg-transparent shadow-sm">
			<NavbarBrand>
				<Link href="/" className="flex items-center">
					<AcmeLogo />
					<p className="font-bold text-inherit">ACME</p>
				</Link>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarSearch />
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<CartNavbarTrigger />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
