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
		>
			<PopoverTrigger>
				<Button
					as={Link}
					href="#"
					className="border-none bg-transparent text-white"
					onPress={() => setOpenPopover((prev) => !prev)}
				>
					<Badge
						content={products.length}
						color="danger"
						variant="solid"
						className="border-none"
						size="sm"
						isInvisible={products.length === 0}
					>
						<ShoppingCartIcon width={24} />
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
