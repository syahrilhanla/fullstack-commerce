"use client";

import { useEffect, useState } from "react";

import { TrashIcon } from "@heroicons/react/16/solid";
import { Button, Checkbox } from "@heroui/react";

import CartProductItem from "@/components/Cart/CartProductItem";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";

import { useCartStore } from "@/store/cart.store";
import { CartProduct } from "@/types/Cart.type";
import { useFetchQuery } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";

const CartPage = () => {
	const {
		products,
		total,
		clearCart,
		removeProduct,
		updateProduct,
		addProduct,
	} = useCartStore();
	const { userInfo } = useUserInfoStore();

	const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

	const { data, isLoading, isError } = useFetchQuery(
		`http://localhost:8000/api/cart/cart_items/?user=${userInfo?.id}`,
		[userInfo?.id ? `cart-${userInfo.id}` : "cart"],
		!!userInfo?.id
	);

	useEffect(() => {
		if (data) {
			data?.length &&
				data.forEach((item: CartProduct) => {
					const existingProduct = products.find(
						(product) => product.id === item.id
					);
					if (!existingProduct) {
						addProduct({
							...item,
							quantity: item.quantity,
						});
					}
				});
		}
	}, [data, products, addProduct]);

	const selectedProducts = products.filter((product) =>
		selectedProductIds.includes(product.id)
	);

	// TODO:
	// 1. fix total sub price (discounted + real)
	// 2. fix total price (discounted + real)
	// 3. find out if caused by API or local memory (discounted + real)
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
			const allProductIds = products.map((product) => product.id);
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
											removeProduct(product.id);
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
						total={totalSummary}
					/>
				</div>
			)}
		</div>
	);
};

export default CartPage;
