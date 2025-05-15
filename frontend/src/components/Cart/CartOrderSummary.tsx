import { formatPriceIDR } from "@/helpers/helpers";
import { CartProduct } from "@/types/Cart.type";
import { Card, CardBody, Button } from "@heroui/react";

interface Props {
	selectedProducts: CartProduct[];
	total: number;
	totalDiscountedPrice: number;
}

const CartOrderSummary = ({
	selectedProducts,
	total,
	totalDiscountedPrice,
}: Props) => {
	return (
		<Card className="bg-current">
			<CardBody>
				<div className="text-gray-200 px-4">
					<h2 className="text-lg font-bold mb-2">Order Summary</h2>

					<div>
						<span>Details</span>
						<div className="grid gap-1 py-3 text-sm text-gray-300">
							{selectedProducts.map((product) => (
								<div
									key={product.id}
									className="w-full flex justify-between py-1"
								>
									<span>
										{product.title} x {product.quantity}
									</span>
									<div className="flex flex-col items-end">
										<span className="text-gray-500 line-through text-sm">
											{formatPriceIDR(product.total * 1000)}
										</span>
										<span className="text-gray-200 font-semibold">
											{formatPriceIDR(product.discountedTotal * 1000)}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

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
											(acc, product) => acc + product.discountedTotal * 1000,
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
	);
};

export default CartOrderSummary;
