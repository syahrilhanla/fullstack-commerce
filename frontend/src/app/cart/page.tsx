"use client";

import { useState } from "react";

import { TrashIcon } from "@heroicons/react/16/solid";
import { Button, Checkbox } from "@heroui/react";

import CartProductItem from "@/components/Cart/CartProductItem";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";

import { useCartStore } from "@/store/cart.store";
import { apiPost } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";

const CartPage = () => {
	const { products, clearCart, removeProduct, updateProduct } = useCartStore();
	const { accessToken } = useUserInfoStore();

	const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

	const selectedProducts = products.filter((product) =>
		selectedProductIds.includes(product.productId)
	);

	const totalSummary = selectedProducts.reduce(
		(acc, product) => acc + product.price * product.quantity,
		0
	);

	// TODO:
	// 1. merge local storage guest cart with user cart when user logs in
	// 2. remove guest cart when user logs in
	// 3. handle product quantity update to server
	// 4. handle product removal from server

	const handleSelectProduct = (productId: number) => {
		const isSelected = selectedProductIds.includes(productId);
		if (isSelected) {
			// unselect product
			setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
		} else {
			// select product
			setSelectedProductIds((prev) => [...prev, productId]);
		}
	};

	const handleSelectAll = (isChecked: boolean) => {
		if (isChecked) {
			// select all products
			const allProductIds = products.map((product) => product.productId);
			setSelectedProductIds(allProductIds);
		} else {
			// unselect all products
			setSelectedProductIds([]);
		}
	};

	const handleDirectQuantity = (valueInput: string, productId: number) => {
		const quantity = parseInt(valueInput);
		if (isNaN(quantity) || quantity < 1) return;
		updateProduct(productId, quantity);
	};

	const handleUpdateQuantity = async (
		productId: number,
		type: "increase" | "decrease"
	) => {
		const cartItem = products.find(
			(product) => product.productId === productId
		);

		if (cartItem) {
			let newQuantity =
				type === "decrease" ? cartItem.quantity - 1 : cartItem.quantity + 1;

			if (
				type === "decrease" &&
				cartItem.quantity > cartItem.minimumOrderQuantity
			) {
				updateProduct(productId, newQuantity);
			} else if (type === "increase" && cartItem.quantity < cartItem.stock) {
				updateProduct(productId, newQuantity);
			}

			await apiPost(
				`http://localhost:8000/api/cart/${cartItem.id}/update_cart_item/`,
				{
					cart_item_id: cartItem.id,
					quantity: newQuantity,
				},
				accessToken,
				"PUT"
			);
		}
	};

	const totalDiscountedPrice = selectedProducts.reduce(
		(acc, product) => acc + product.total,
		0
	);

	return (
		<div>
			<h1 className="text-2xl font-bold my-4">Your Cart</h1>

			{products.length === 0 ? (
				<p className="text-gray-500">Your cart is empty</p>
			) : (
				<div className="w-full grid grid-cols-[2fr_1fr] gap-4 min-w-[45dvw] mx-auto">
					<div>
						<div className="flex justify-between items-center mb-3">
							<label className="cursor-pointer flex items-center">
								<Checkbox
									id="selectAll"
									size="md"
									color="success"
									className="ml-7 max-h-8 -mt-2"
									onChange={(e) => {
										handleSelectAll(e.target.checked);
									}}
									isSelected={selectedProducts.length === products.length}
								/>
								<span className="text-gray-600 text-sm font-semibold ml-1">
									Select All (
									<span className="font-light">{products.length}</span>)
								</span>
							</label>

							<Button
								variant="bordered"
								size="sm"
								hidden={selectedProducts.length === 0}
								className={`p-3 max-w-min border-none font-semibold ${
									selectedProducts.length === 0
										? "opacity-0 pointer-events-none"
										: "opacity-100"
								}`}
								onPress={() => {
									if (selectedProducts.length === 0) return;
									if (selectedProducts.length === products.length) {
										clearCart();
									} else {
										selectedProducts.forEach((product) => {
											removeProduct(product.productId);
										});
									}

									// Clear selected products
									setSelectedProductIds([]);
								}}
							>
								<TrashIcon width={20} color="gray" />
							</Button>
						</div>

						{products.map((product) => (
							<CartProductItem
								key={product.productId}
								product={product}
								handleSelectProduct={handleSelectProduct}
								handleUpdateQuantity={handleUpdateQuantity}
								handleDirectQuantity={handleDirectQuantity}
								selectedProducts={selectedProducts}
							/>
						))}
					</div>

					<CartOrderSummary
						selectedProducts={selectedProducts}
						totalDiscountedPrice={totalDiscountedPrice}
						total={totalSummary}
					/>
				</div>
			)}
		</div>
	);
};

export default CartPage;
