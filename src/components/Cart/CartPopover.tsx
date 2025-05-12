"use client";

import { Button, Image } from "@heroui/react";
import Link from "next/link";

import { formatPriceIDR } from "@/helpers/helpers";

import { CartProduct } from "@/types/Cart.type";
import { useCartStore } from "@/store/cart.store";

interface Props {
	closePopover: () => void;
}

const CartPopover = ({ closePopover }: Props) => {
	const { products: cartProducts, total } = useCartStore();

	return (
		<div className="absolute right-0 top-0 w-96 bg-gray-800 text-white rounded-lg shadow-lg p-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Your Cart</h3>
				<Link
					href="/cart"
					className="text-sm text-gray-400 hover:text-gray-200 duration-200"
					onClick={() => closePopover()}
				>
					View All
				</Link>
			</div>
			<div className="flex flex-col gap-4">
				{cartProducts.length > 0 &&
					cartProducts.map((item: CartProduct) => (
						<Link
							href={"/products/" + item.id}
							key={item.id}
							className="flex items-center gap-4"
							onClick={() => closePopover()}
						>
							<Image
								src={item.thumbnail}
								alt={item.title}
								width={64}
								height={64}
								className="w-16 h-16 object-cover rounded"
							/>
							<div className="flex-1">
								<h4 className="text-sm font-medium line-clamp-1">
									{item.title}
								</h4>
								<p className="text-sm text-gray-400">
									{item.quantity} x {formatPriceIDR(item.price * 1000)}
								</p>
							</div>
							<div>
								<p className="text-sm font-semibold">
									{formatPriceIDR(item.discountedTotal * 1000)}
								</p>
								<p className="text-sm text-gray-400 line-through">
									{formatPriceIDR(item.total * 1000)}
								</p>
							</div>
						</Link>
					))}

				{cartProducts.length === 0 && (
					<p className="text-center text-gray-400">Your cart is empty</p>
				)}
			</div>
			<hr className="my-4 border-gray-700" />
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Total:</p>
				<p className="text-lg font-semibold">{formatPriceIDR(total * 1000)}</p>
			</div>
			<Button
				variant="solid"
				color="success"
				fullWidth
				className="mt-2 text-white font-semibold disabled:cursor-not-allowed"
				isDisabled={cartProducts.length === 0}
			>
				Checkout
			</Button>
		</div>
	);
};

export default CartPopover;
