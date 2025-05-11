"use client";

import { Button, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { formatPriceIDR } from "@/helpers/helpers";

import { Cart, CartProduct } from "@/types/Cart.type";

const CartPopover = () => {
	const { data, isError, isLoading } = useQuery<Cart>({
		queryKey: ["cartItems"],
		queryFn: async () => {
			const response = await fetch("https://dummyjson.com/carts/1");
			if (!response.ok) {
				throw new Error("Failed to fetch cart items");
			}
			return response.json();
		},
	});

	if (isLoading) {
		return <div className="text-white">Loading cart...</div>;
	}

	if (isError || !data) {
		return <div className="text-red-500">Failed to load cart items.</div>;
	}

	const { products, discountedTotal } = data;

	return (
		<div className="absolute right-0 top-0 w-96 bg-gray-800 text-white rounded-lg shadow-lg p-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Your Cart</h3>
			</div>
			<div className="flex flex-col gap-4">
				{products.map((item: CartProduct) => (
					<div key={item.id} className="flex items-center gap-4">
						<Image
							src={item.thumbnail}
							alt={item.title}
							width={64}
							height={64}
							className="w-16 h-16 object-cover rounded"
						/>
						<div className="flex-1">
							<h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
							<p className="text-sm text-gray-400">
								{item.quantity} x {formatPriceIDR(item.price * 1000)}
							</p>
						</div>
						<div>
							<p className="text-sm font-semibold">
								{formatPriceIDR(item.discountedTotal * 1000)}
							</p>
							<p className="text-sm text-gray-400 line-through">
								{formatPriceIDR(item.price * item.quantity * 1000)}
							</p>
						</div>
					</div>
				))}
			</div>
			<hr className="my-4 border-gray-700" />
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Total:</p>
				<p className="text-lg font-semibold">
					{formatPriceIDR(discountedTotal * 1000)}
				</p>
			</div>
			<Button
				variant="solid"
				color="success"
				fullWidth
				className="mt-2 text-white font-semibold"
			>
				Checkout
			</Button>
		</div>
	);
};

export default CartPopover;
