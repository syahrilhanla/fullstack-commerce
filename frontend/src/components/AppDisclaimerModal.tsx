"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
} from "@heroui/react";
import { useState, useEffect } from "react";

const AppDisclaimerModal = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		// Show disclaimer only once per session
		if (!sessionStorage.getItem("disclaimer_shown")) {
			setOpen(true);
			sessionStorage.setItem("disclaimer_shown", "1");
		}
	}, []);

	return (
		<Modal isOpen={open} onClose={() => setOpen(false)}>
			<ModalContent>
				<ModalHeader>Disclaimer</ModalHeader>
				<ModalBody>
					<p className="mb-2 text-gray-800 text-sm">
						This is a{" "}
						<span className="font-semibold">demo e-commerce application</span>{" "}
						built with <span className="font-medium">Django REST</span> and{" "}
						<span className="font-medium">Next.js/React</span>. All product,
						order, and payment data are for{" "}
						<span className="font-semibold text-yellow-700">
							demonstration purposes only
						</span>{" "}
						and do not represent real transactions.
					</p>
					<p className="text-gray-600 text-sm">
						By using this app, you acknowledge that{" "}
						<span className="font-semibold text-red-600">
							no real purchases or deliveries will occur
						</span>
						. Please{" "}
						<span className="font-semibold underline">
							do not enter sensitive or real payment information
						</span>
						.
					</p>
					<Button
						color="success"
						className="mt-4 w-full text-white font-semibold"
						onPress={() => setOpen(false)}
					>
						I Understand
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AppDisclaimerModal;
