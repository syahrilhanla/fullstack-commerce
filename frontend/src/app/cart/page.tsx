"use client";

import { useState } from "react";

import { TrashIcon } from "@heroicons/react/16/solid";
import { Button, Checkbox } from "@heroui/react";

import CartProductItem from "@/components/Cart/CartProductItem";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";

import { useCartStore } from "@/store/cart.store";
import { apiPost } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";
import { countDiscountedPrice } from "@/helpers/helpers";

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

	const updateCartItemQuantity = async (
		cartItemId: number,
		quantity: number
	) => {
		await apiPost(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${cartItemId}/update_cart_item/`,
			{
				cart_item_id: cartItemId,
				quantity,
			},
			accessToken,
			"PUT"
		);
	};

	const batchRemoveCartItems = async (cartItemIds: number[]) => {
		await apiPost(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${products[0].cartId}/batch_remove_cart_items/`,
			{
				cart_item_ids: cartItemIds,
			},
			accessToken,
			"DELETE"
		);
	};

	const handleDirectQuantity = async (
		valueInput: string,
		productId: number
	) => {
		const quantity = parseInt(valueInput);
		if (isNaN(quantity) || quantity < 1) return;
		updateProduct(productId, quantity);

		await updateCartItemQuantity(
			products.find((product) => product.productId === productId)?.id as number,
			quantity
		);
	};

	const handleUpdateQuantity = async (
		productId: number,
		type: "increase" | "decrease"
	) => {
		const cartItem = products.find(
			(product) => product.productId === productId
		);

		if (cartItem) {
			const newQuantity =
				type === "decrease" ? cartItem.quantity - 1 : cartItem.quantity + 1;

			if (
				type === "decrease" &&
				cartItem.quantity > cartItem.minimumOrderQuantity
			) {
				updateProduct(productId, newQuantity);
			} else if (type === "increase" && cartItem.quantity < cartItem.stock) {
				updateProduct(productId, newQuantity);
			}

			await updateCartItemQuantity(cartItem.id as number, newQuantity);
		}
	};

	const totalDiscountedPrice = selectedProducts.reduce(
		(acc, product) =>
			acc +
			countDiscountedPrice(product.price * 1000, product.discountPercentage) *
				product.quantity,
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
								onPress={async () => {
									if (selectedProducts.length === 0) return;

									if (selectedProducts.length === products.length) {
										clearCart();
										setSelectedProductIds([]);
									} else {
										selectedProducts.forEach((product) => {
											removeProduct(product.productId);
										});
									}

									const itemsToRemove = selectedProducts.map(
										(product) => product.id as number
									);

									await batchRemoveCartItems(itemsToRemove);
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
								batchRemoveCartItems={batchRemoveCartItems}
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
