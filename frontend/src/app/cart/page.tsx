"use client";

import { useState } from "react";

import { TrashIcon } from "@heroicons/react/16/solid";
import { Button, Checkbox } from "@heroui/react";

import CartProductItem from "@/components/Cart/CartProductItem";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";

import { useCartStore } from "@/store/cart.store";
import { CartProduct } from "@/types/Cart.type";

const CartPage = () => {
	const { products, total, clearCart, removeProduct, updateProduct } =
		useCartStore();

	const [selectedProducts, setSelectedProducts] = useState<CartProduct[]>([]);

	const handleSelectProduct = (productId: number) => {
		const isSelected = selectedProducts.some(
			(product) => product.id === productId
		);
		if (isSelected) {
			setSelectedProducts(
				selectedProducts.filter((product) => product.id !== productId)
			);
		} else {
			const selectedProduct = products.find(
				(product) => product.id === productId
			);
			if (selectedProduct) {
				setSelectedProducts([...selectedProducts, selectedProduct]);
			}
		}
	};

	const handleSelectAll = (isChecked: boolean) => {
		if (isChecked) {
			setSelectedProducts(products);
		} else {
			setSelectedProducts([]);
		}
	};

	const handleDirectQuantity = (valueInput: string, productId: number) => {
		const quantity = parseInt(valueInput);
		if (isNaN(quantity) || quantity < 1) return;
		updateProduct(productId, quantity);

		// update the selectedProducts state
		const updatedProducts = selectedProducts.map((product) => {
			if (product.id === productId) {
				return { ...product, quantity };
			}
			return product;
		});

		setSelectedProducts(updatedProducts);
	};

	const handleUpdateQuantity = (
		productId: number,
		type: "increase" | "decrease"
	) => {
		const product = products.find((product) => product.id === productId);

		let newQuantity = 0;

		if (product) {
			if (
				type === "decrease" &&
				product.quantity > product.minimumOrderQuantity
			) {
				updateProduct(productId, product.quantity - 1);

				newQuantity = product.quantity - 1;
			} else if (type === "increase" && product.quantity < product.stock) {
				updateProduct(productId, product.quantity + 1);

				newQuantity = product.quantity + 1;
			}

			// update the selectedProducts state
			const updatedProducts = selectedProducts.map((item) => {
				if (item.id === productId) {
					return {
						...item,
						quantity: newQuantity,
					};
				}
				return item;
			});

			setSelectedProducts(updatedProducts);
		}
	};

	const totalDiscountedPrice = selectedProducts.reduce(
		(acc, product) => acc + product.discountedTotal * 1000,
		0
	);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Your Cart</h1>

			{products.length === 0 ? (
				<p>Your cart is empty</p>
			) : (
				<div className="w-full grid grid-cols-[2fr_1fr] gap-4 min-w-[45dvw] mx-auto">
					<div>
						<div className="flex justify-between mb-4 items-center">
							<label htmlFor="selectAll" className="cursor-pointer">
								<Checkbox
									id="selectAll"
									size="md"
									color="success"
									className="ml-4 max-h-8 mt-3"
									onChange={(e) => {
										handleSelectAll(e.target.checked);
									}}
									isSelected={selectedProducts.length === products.length}
								/>
								<span className="text-gray-200 text-base">
									Select All ({products.length} products)
								</span>
							</label>

							{selectedProducts.length > 0 && (
								<Button
									variant="bordered"
									color="danger"
									size="sm"
									className="mt-6 p-3 max-w-min border-none"
									onPress={() => {
										if (selectedProducts.length === 0) return;
										if (selectedProducts.length === products.length) {
											clearCart();
										} else {
											selectedProducts.forEach((product) => {
												removeProduct(product.id);
											});
										}

										setSelectedProducts([]);
									}}
								>
									<TrashIcon width={20} color="gray" /> Delete
								</Button>
							)}
						</div>

						{products.map((product) => (
							<CartProductItem
								key={product.id}
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
						total={total}
					/>
				</div>
			)}
		</div>
	);
};

export default CartPage;
