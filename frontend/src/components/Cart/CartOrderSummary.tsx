import { createInvoice } from "@/helpers/dataQuery";
import { formatPriceIDR } from "@/helpers/helpers";
import { useUserInfoStore } from "@/store/userInfo.store";
import { CartProduct } from "@/types/Cart.type";
import { Card, CardBody, Button, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";

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
	const { userInfo } = useUserInfoStore();

	const router = useRouter();

	const handleCheckout = async () => {
		if (!userInfo) {
			router.push("?login=true", { scroll: false });
			return;
		}

		if (selectedProducts.length === 0) return;

		const selectedProductIds = selectedProducts.map(
			(product) => product.productId
		);

		await createInvoice(selectedProductIds, totalDiscountedPrice);
	};

	return (
		<Card className="bg-white border border-gray-200 max-h-[65dvh]" shadow="md">
			<CardBody>
				<div className="text-gray-700 px-4">
					<h2 className="text-lg font-bold mb-2">Order Summary</h2>

					<div>
						<span className="text-gray-700">Details</span>
						<div className="grid gap-1 py-3 text-sm text-gray-700">
							{selectedProducts.length ? (
								selectedProducts.map((product) => (
									<div
										key={product.productId}
										className="w-full flex justify-between py-1"
									>
										<span>
											{product.title} x {product.quantity}
										</span>
										<div className="flex flex-col items-end">
											<span className="text-gray-400 line-through text-sm text-right">
												{formatPriceIDR(product.total * 1000)}
											</span>
											<span className="text-gray-700 font-semibold text-right">
												{formatPriceIDR(product.discountedTotal)}
											</span>
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-gray-400">
									Select products to see details
								</p>
							)}
						</div>
					</div>

					{/* TODO:
						1. item price calculation in cart page
					*/}

					{selectedProducts.length > 0 ? (
						<div className="flex justify-between py-3">
							<span className="text-gray-700">Total</span>
							<div className="grid">
								{selectedProducts.length > 0 ? (
									<p className="line-through text-gray-400 font-normal text-sm text-right">
										{formatPriceIDR(total * 1000)}
									</p>
								) : (
									"-"
								)}
								{totalDiscountedPrice ? (
									<p className="font-semibold text-gray-700 text-right">
										{formatPriceIDR(totalDiscountedPrice)}
									</p>
								) : null}
							</div>
						</div>
					) : null}
				</div>
			</CardBody>

			<CardFooter>
				<Button
					variant="solid"
					color="success"
					fullWidth
					className="text-white font-semibold disabled:cursor-not-allowed"
					isDisabled={selectedProducts.length === 0}
					onPress={() => {
						handleCheckout();
					}}
				>
					Checkout ({selectedProducts.length})
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CartOrderSummary;
