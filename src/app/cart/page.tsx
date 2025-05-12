"use client";

import { useState } from "react";
import Link from "next/link";

import { TrashIcon } from "@heroicons/react/16/solid";
import { Button, Card, CardBody, Checkbox, Image } from "@heroui/react";

import { formatPriceIDR } from "@/helpers/helpers";
import { useCartStore } from "@/store/cart.store";
import { CartProduct } from "@/types/Cart.type";

const CartPage = () => {
	const { products, total, clearCart, removeProduct } = useCartStore();

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
							<Card
								radius="lg"
								key={product.id}
								className="mb-4 bg-current h-20"
								fullWidth
							>
								<CardBody>
									<div className="grid grid-cols-[1fr_8fr_1fr] gap-2 overflow-hidden">
										<Checkbox
											size="md"
											color="success"
											className="ml-4 max-h-8 mt-3"
											onChange={() => handleSelectProduct(product.id)}
											isSelected={selectedProducts.some(
												(selectedProduct) => selectedProduct.id === product.id
											)}
										/>

										<div className="-ml-4 w-full flex flex-col gap-1 text-gray-300">
											<div className="grid grid-cols-[2fr_0.1fr] gap-2">
												<span className="flex gap-2">
													<Image
														src={product.thumbnail}
														alt={product.title}
														className="w-full h-full object-cover rounded-lg"
														width={60}
													/>
													<Link
														className="text-base"
														href={`/products/${product.id}`}
													>
														{product.title}
													</Link>
												</span>
												<Button
													variant="bordered"
													color="danger"
													size="sm"
													className="mt-6 p-3 max-w-min border-none"
												>
													<TrashIcon width={20} color="gray" />
												</Button>
											</div>
										</div>

										<div className="flex flex-col items-end justify-center text-gray-200">
											<p className="text-sm line-through text-gray-500">
												{formatPriceIDR(product.total * 1000)}
											</p>
											<p className="text-lg font-semibold">
												{formatPriceIDR(product.discountedTotal * 1000)}
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						))}
					</div>

					<Card className="bg-current">
						<CardBody>
							<div className="text-gray-200 px-4">
								<h2 className="text-lg font-bold mb-2">Order Summary</h2>

								<div className="flex justify-between py-3">
									<span>Total</span>
									<div className="grid">
										{selectedProducts.length > 0 ? (
											<p className="line-through text-gray-500 font-normal text-sm">
												{formatPriceIDR(total * 1000)}
											</p>
										) : (
											"-"
										)}
										{totalDiscountedPrice ? (
											<p className="font-semibold">
												{formatPriceIDR(
													selectedProducts.reduce(
														(acc, product) =>
															acc + product.discountedTotal * 1000,
														0
													)
												)}
											</p>
										) : null}
									</div>
								</div>
								<Button
									variant="solid"
									color="success"
									fullWidth
									className="mt-2 text-white font-semibold disabled:cursor-not-allowed"
									isDisabled={selectedProducts.length === 0}
									onPress={() => {
										// Handle checkout logic here
									}}
								>
									Checkout ({selectedProducts.length})
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			)}
		</div>
	);
};

export default CartPage;
