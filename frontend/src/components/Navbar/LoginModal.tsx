"use client";

import { useState } from "react";
// Import HeroUI components (adjust import paths as needed for your setup)
import {
	Modal,
	Input,
	Button,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@heroui/react";

const LoginModal = ({
	open,
	onClose,
}: {
	open?: "login" | "register";
	onClose?: () => void;
}) => {
	const [mode, setMode] = useState<"login" | "register">(open || "login");
	const [form, setForm] = useState({
		username: "",
		password: "",
		email: "",
		firstName: "",
		lastName: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (mode === "login") {
				// Replace with your login API call
				alert(`Logging in as ${form.username}`);
			} else {
				// Replace with your register API call
				alert(`Registering as ${form.username}`);
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
											required
										/>
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
