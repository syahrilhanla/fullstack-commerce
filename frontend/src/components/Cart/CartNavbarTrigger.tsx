"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import {
	Popover,
	PopoverTrigger,
	Button,
	Badge,
	PopoverContent,
} from "@heroui/react";
import Link from "next/link";
import CartPopover from "./CartPopover";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";

const CartNavbarTrigger = () => {
	const { products } = useCartStore();

	const [openPopover, setOpenPopover] = useState(false);

	return (
		<Popover
			backdrop="opaque"
			isOpen={openPopover}
			onOpenChange={setOpenPopover}
			shouldCloseOnBlur
			shouldBlockScroll
			shouldCloseOnScroll
		>
			<PopoverTrigger>
				<Button
					as={Link}
					href="#"
					className="h-10 w-10 border-none bg-transparent text-gray-800 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ease-in-out"
					onPress={() => setOpenPopover((prev) => !prev)}
					size="sm"
					isIconOnly
				>
					<Badge
						content={products.length}
						color="danger"
						variant="solid"
						className="border-none"
						size="sm"
						isInvisible={products.length === 0}
					>
						<ShoppingCartIcon height={24} />
					</Badge>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<CartPopover closePopover={() => setOpenPopover(false)} />
			</PopoverContent>
		</Popover>
	);
};

export default CartNavbarTrigger;
