"use client";

import { useState } from "react";
import { Product } from "@/types/Product.type";
import { PencilIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { countDiscountedPrice, formatPriceIDR } from "@/helpers/helpers";
import { Button } from "@heroui/react";
import { useCartStore } from "@/store/cart.store";
import QuantityModifier from "./QuantityModifier";
import { apiPost } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";
import { CartProduct } from "@/types/Cart.type";

interface Props {
	product: Product;
}

const ProductProcess = ({ product }: Props) => {
	const { stock, minimumOrderQuantity, price, discountPercentage } = product;
	const { accessToken, userInfo } = useUserInfoStore();

	const [quantity, setQuantity] = useState(minimumOrderQuantity);
	const [notes, setNotes] = useState<string | null>(null);
	const [error, setError] = useState("");

	const { addProduct } = useCartStore();

	const handleAddProduct = async () => {
		let cartId: number | null = null;
		let cartItemId: number | null = null;

		if (userInfo) {
			const { data } = await apiPost(
				"http://localhost:8000/api/cart/add_to_cart/",
				{
					user: userInfo?.id,
					product_id: product.id,
					quantity: quantity,
					notes: notes,
				},
				accessToken
			);

			cartId = data.cart_item.cart;
			cartItemId = data.cart_item.id;
		}

		const cartItem: CartProduct = {
			id: cartItemId,
			productId: product.id,
			cartId,
			title: product.title,
			thumbnail: product.thumbnail,
			price: product.price,
			discountPercentage: product.discountPercentage,
			quantity: quantity,
			stock: product.stock,
			minimumOrderQuantity: product.minimumOrderQuantity,
			total: 0,
			discountedTotal:
				countDiscountedPrice(product.price * 1000, product.discountPercentage) *
				quantity,
		};

		addProduct(cartItem);
	};

	const increase = () => {
		if (quantity < stock) {
			setQuantity((prev) => prev + 1);
		} else {
			setError("Maximum stock reached");

			setTimeout(() => {
				setError("");
				setQuantity(stock);
			}, 2000);
		}
	};

	const decrease = () => {
		if (quantity > minimumOrderQuantity) {
			setQuantity((prev) => prev - 1);
		} else {
			setError("Minimum order quantity reached");

			setTimeout(() => {
				setError("");
				setQuantity(minimumOrderQuantity);
			}, 2000);
		}
	};

	const handleDirectQuantity = (valueInput: string) => {
		const value = Number(valueInput);
		if (!isNaN(value) && value >= 1 && value <= stock) {
			setQuantity(value);
		}

		if (value < minimumOrderQuantity) {
			setError("Minimum order quantity reached");

			setTimeout(() => {
				setError("");
				setQuantity(minimumOrderQuantity);
			}, 2000);
		} else if (value > stock) {
			setError("Maximum stock reached");

			setTimeout(() => {
				setError("");
				setQuantity(stock);
			}, 2000);
		} else {
			setError("");
		}
	};

	return (
		<aside className="px-6">
			<div className="w-full px-6 py-4 rounded-lg border border-gray-200 bg-white">
				<h5 className="text-gray-700 text-xl font-semibold">
					Set Quantity and Notes
				</h5>

				<div className="flex items-center gap-4 text-gray-700 mt-4">
					<QuantityModifier
						decrease={decrease}
						increase={increase}
						quantity={quantity}
						handleDirectQuantity={handleDirectQuantity}
					/>
					<span className="text-lg">
						Stock: <strong>{stock}</strong>
					</span>
				</div>
				{error && <span className="text-red-500 text-sm ml-2">{error}</span>}

				<hr className="border-gray-200 border-t my-2" />

				<div className="flex flex-col gap-2">
					{notes === null && (
						<button
							className="text-sm w-fit text-gray-500 flex gap-2"
							onClick={() => setNotes("")}
						>
							<PencilIcon width={12} />
							Add notes
						</button>
					)}

					{notes !== null && (
						<>
							<label
								htmlFor="notes"
								className="text-gray-700 text-sm font-semibold"
							>
								Notes
							</label>
							<textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="w-full h-24 text-sm bg-transparent border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none"
								placeholder="Add any special instructions or notes here..."
							/>
							<button
								className="text-sm text-gray-500 flex gap-2"
								onClick={() => setNotes(null)}
							>
								<PencilIcon width={12} />
								Remove notes?
							</button>
						</>
					)}

					<p className="w-full text-sm text-gray-400 line-through text-right leading-3">
						{formatPriceIDR(price * quantity * 1000)}
					</p>
					<div className="flex items-center justify-between leading-3">
						<span className="text-gray-500 text-sm">Subtotal</span>
						<span className="text-gray-700 text-xl font-semibold">
							{formatPriceIDR(
								countDiscountedPrice(price * 1000, discountPercentage) *
									quantity
							)}
						</span>
					</div>
				</div>

				<div className="py-2 space-y-2">
					<Button
						variant="solid"
						color="success"
						fullWidth
						size="md"
						radius="md"
						className="text-white font-semibold"
						onPress={() => handleAddProduct()}
					>
						<ShoppingCartIcon width={20} />
						Add to Cart
					</Button>
					<Button
						variant="bordered"
						color="success"
						fullWidth
						size="md"
						radius="md"
						className="text-green-600 font-semibold border border-green-400 bg-white"
					>
						Buy Now
					</Button>
				</div>
			</div>
		</aside>
	);
};

export default ProductProcess;
