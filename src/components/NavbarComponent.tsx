import {
	MagnifyingGlassIcon,
	ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
	Input,
} from "@heroui/react";

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
				<AcmeLogo />
				<p className="font-bold text-inherit">ACME</p>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<Input
					classNames={{
						base: "w-[24rem] h-10",
						mainWrapper: "h-full",
						input: "text-small",
						inputWrapper:
							"h-full font-normal text-default-500 bg-default-400/20",
					}}
					placeholder="Search product"
					size="sm"
					startContent={<MagnifyingGlassIcon height={24} />}
					type="search"
				/>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Button
						as={Link}
						href="#"
						className="border-none bg-transparent text-white"
					>
						<ShoppingCartIcon width={24} />
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
