import Link from "next/link";

import {
	addToast,
	Button,
	Divider,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	User,
} from "@heroui/react";
import CartNavbarTrigger from "../Cart/CartNavbarTrigger";
import NavbarSearch from "./NavbarSearch";
import { Suspense } from "react";
import LoginModal from "./LoginModal";
import { useUserInfoStore } from "@/store/userInfo.store";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { apiPost } from "@/helpers/dataQuery";
import { useRouter, useSearchParams } from "next/navigation";

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
	const { userInfo, clearUserInfo, accessToken, setAccessToken } =
		useUserInfoStore();

	const router = useRouter();
	const searchParams = useSearchParams();
	const modalState: "register" | "login" | null =
		(searchParams.get("register") && "register") ||
		(searchParams.get("login") && "login") ||
		null;

	const handleCloseModal = () => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.delete("login");
		params.delete("register");
		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<Navbar
			maxWidth="full"
			className="bg-transparent shadow-sm"
			position="sticky"
		>
			{modalState && (
				<Suspense fallback={<div>Loading...</div>}>
					<LoginModal modalState={modalState} onClose={handleCloseModal} />
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
					{!userInfo ? (
						<>
							<Button
								variant="bordered"
								color="success"
								size="sm"
								onPress={() => {
									router.push("?login=true", { scroll: false });
								}}
								className="text-sm font-semibold text-success-600"
							>
								Login
							</Button>
							<Button
								variant="solid"
								color="success"
								size="sm"
								onPress={() => {
									router.push("?register=true", { scroll: false });
								}}
								className="text-sm font-semibold text-white"
							>
								Register
							</Button>
						</>
					) : (
						<>
							<User
								avatarProps={{
									src: "https://images.tokopedia.net/img/cache/300/tPxBYm/2023/1/20/00d6ff75-2a9e-4639-9f11-efe55dcd0885.jpg",
									size: "sm",
								}}
								description={userInfo.userName}
								name={userInfo.name}
							/>
							<Button
								variant="light"
								isIconOnly
								onPress={async () => {
									clearUserInfo();
									setAccessToken(null);

									try {
										await apiPost(
											"http://localhost:8000/api/auth/logout/",
											{},
											accessToken
										);

										addToast({
											title: "Success",
											description: "Logout successfully",
											variant: "solid",
											color: "success",
											classNames: {
												title: "text-white text-base font-semibold",
												icon: "text-white",
												description: "text-white",
											},
										});
									} catch (error) {
										console.error("Logout failed", error);

										addToast({
											title: "Failed",
											description: "Logout failed, please try again later",
											variant: "solid",
											color: "danger",
											classNames: {
												title: "text-white text-base font-semibold",
												icon: "text-white",
												description: "text-white",
											},
										});
									}
								}}
								startContent={
									<ArrowLeftStartOnRectangleIcon width={24} color="gray" />
								}
							/>
						</>
					)}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
