"use client";

import { useCartStore } from "@/store/cart.store";

const CartPage = () => {
	const { products, total, clearCart, removeProduct } = useCartStore();

	return (
		<div>
			<h1 className="text-2xl font-bold">Your Cart</h1>

			{products.length === 0 ? (
				<p>Your cart is empty</p>
			) : (
				<div>
					{products.map((product) => (
						<div key={product.id} className="flex items-center justify-between">
							<div>
								<h2>{product.title}</h2>
								<p>Quantity: {product.quantity}</p>
								<p>Total: {product.discountedTotal}</p>
							</div>
							<button onClick={() => removeProduct(product.id)}>Remove</button>
						</div>
					))}
					<h2>Total: {total}</h2>
					<button onClick={clearCart}>Clear Cart</button>
				</div>
			)}
		</div>
	);
};

export default CartPage;
