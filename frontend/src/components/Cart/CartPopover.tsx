"use client";

import { Image } from "@heroui/react";
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
		<div className="absolute right-0 top-0 w-96 max-h-[40dvh] overflow-auto bg-white text-gray-700 rounded-lg shadow-lg pt-4 px-4 border border-gray-200">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Your Cart</h3>
				<Link
					href="/cart"
					className="text-sm text-green-500 hover:text-green-600 duration-200"
					onClick={() => closePopover()}
				>
					View All
				</Link>
			</div>
			<div className="flex flex-col gap-4">
				{cartProducts.length > 0 &&
					cartProducts.map((item: CartProduct) => (
						<Link
							href={"/products/" + item.productId}
							key={item.productId}
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
								<p className="text-sm text-gray-500">
									{item.quantity} x {formatPriceIDR(item.price * 1000)}
								</p>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-700">
									{formatPriceIDR(item.discountedTotal)}
								</p>
								<p className="text-sm text-gray-400 line-through">
									{formatPriceIDR(item.price * 1000 * item.quantity)}
								</p>
							</div>
						</Link>
					))}

				{cartProducts.length === 0 && (
					<p className="text-center text-gray-500">Your cart is empty</p>
				)}
			</div>
			<div className="sticky bottom-0 bg-white z-10 py-2">
				<hr className="my-4 border-gray-200" />
				<div className="flex items-center justify-between">
					<p className="text-sm">Total:</p>
					<p className="text-base font-semibold">{formatPriceIDR(total)}</p>
				</div>
			</div>
		</div>
	);
};

export default CartPopover;
