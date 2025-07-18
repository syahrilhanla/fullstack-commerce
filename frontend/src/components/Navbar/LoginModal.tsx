"use client";

import { useState } from "react";
import {
	Modal,
	Input,
	Button,
	ModalBody,
	ModalContent,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { apiPost, getInitialCartItems } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";
import { UserInfo } from "@/types/UserInfo.type";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart.store";
type ModalState = "login" | "register";

const LoginModal = ({
	modalState,
	onClose,
}: {
	modalState: ModalState;
	onClose?: () => void;
}) => {
	const [mode, setMode] = useState<ModalState>(modalState);
	const [form, setForm] = useState({
		username: "",
		password: "",
		email: "",
		whatsapp: "",
		firstName: "",
		lastName: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { setAccessToken, setUserInfo } = useUserInfoStore();
	const { clearCart } = useCartStore();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const processLogin = async () => {
		const { username, password } = form;

		const { data, status } = await apiPost(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login/`,
			{
				username,
				password,
			},
			null
		);

		if (status !== 200) {
			setError("Invalid username or password");
			return;
		}

		const userInfo = data as UserInfo;

		// Handle login success (e.g., save token, close modal, etc.)
		setAccessToken(userInfo.access);
		setUserInfo({
			id: userInfo.id,
			name: `${userInfo.first_name} ${userInfo.last_name}`,
			email: userInfo.email,
			userName: userInfo.username,
		});

		await getInitialCartItems();
		// clear cart after login and merging item with items from DB
		clearCart();

		addToast({
			title: "Success",
			description: "Logged In successfully",
			variant: "solid",
			color: "success",
			classNames: {
				title: "text-white",
				icon: "text-white",
				description: "text-white",
			},
		});

		onClose?.();
	};

	const processRegister = async () => {
		const registerUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register/`;

		const { data, status } = await apiPost(
			registerUrl,
			{
				username: form.username,
				password: form.password,
				email: form.email,
				whatsapp: form.whatsapp,
				first_name: form.firstName,
				last_name: form.lastName,
			},
			null
		);

		if (status !== 201) {
			setError("Registration failed");
			return;
		}

		// Handle login success (e.g., save token, close modal, etc.)
		setAccessToken(data.access);

		addToast({
			title: "Success",
			description: "Registered successfully",
			variant: "solid",
			color: "success",
			classNames: {
				title: "text-white text-base font-semibold",
				icon: "text-white",
				description: "text-white",
			},
		});
		onClose?.();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (mode === "login") {
				await processLogin();
			} else {
				await processRegister();
			}
		} catch (err: unknown) {
			if (
				err &&
				typeof err === "object" &&
				"message" in err &&
				typeof err.message === "string"
			) {
				setError((err as { message: string }).message);
			} else {
				setError("Something went wrong");
			}

			addToast({
				title: "Failed",
				description: `Failed to ${
					mode === "login" ? "login" : "register"
				}, please try again later`,
				variant: "solid",
				color: "danger",
				classNames: {
					title: "text-white text-base font-semibold",
					description: "text-white",
					icon: "text-white",
				},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={Boolean(open)}
			onClose={onClose}
			title={mode === "login" ? "Login" : "Register"}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader>
							<h2 className="text-lg font-semibold">
								{mode === "login" ? "Login" : "Register"}
							</h2>
						</ModalHeader>
						<ModalBody>
							<form onSubmit={handleSubmit} className="space-y-4">
								{mode === "register" && (
									<>
										<Input
											label="First Name"
											name="firstName"
											value={form.firstName}
											onChange={handleChange}
											required
										/>
										<Input
											label="Last Name"
											name="lastName"
											value={form.lastName}
											onChange={handleChange}
											required
										/>
										<Input
											label="Email"
											name="email"
											type="email"
											value={form.email}
											onChange={handleChange}
											// required
										/>
										<Input
											label="Whatsapp Number"
											name="whatsapp"
											value={form.whatsapp}
											onChange={handleChange}
											// required
										/>
										<div className="flex gap-1 items-center text-xs text-gray-400">
											<InformationCircleIcon
												height={12}
												color="text-gray-400"
											/>
											Email and Whatsapp are only used for payment
											notifications.
										</div>
									</>
								)}
								<Input
									label="Username"
									name="username"
									value={form.username}
									onChange={handleChange}
									required
									radius="sm"
								/>
								<Input
									label="Password"
									name="password"
									type="password"
									value={form.password}
									onChange={handleChange}
									required
									radius="sm"
								/>
								{error && <div className="text-red-500 text-sm">{error}</div>}
								<Button
									type="submit"
									isLoading={loading}
									className={
										mode === "login"
											? "text-white font-semibold"
											: "text-success-500 font-semibold"
									}
									radius="sm"
									fullWidth
									color="success"
									variant={mode === "login" ? "solid" : "bordered"}
								>
									{mode === "login" ? "Login" : "Register"}
								</Button>
							</form>
							<div className="py-2 text-center text-sm">
								{mode === "login" ? (
									<span>
										{"Don't have an account? "}
										<button
											onClick={() => setMode("register")}
											className="text-success-500 font-semibold cursor-pointer"
										>
											Register
										</button>
									</span>
								) : (
									<span>
										Already have an account?{" "}
										<button
											onClick={() => setMode("login")}
											className="text-success-500 font-semibold cursor-pointer"
										>
											Login
										</button>
									</span>
								)}
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default LoginModal;
