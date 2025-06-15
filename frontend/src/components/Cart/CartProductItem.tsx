import { countDiscountedPrice, formatPriceIDR } from "@/helpers/helpers";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Checkbox, Button, Image } from "@heroui/react";
import Link from "next/link";
import QuantityModifier from "../ProductDetail/QuantityModifier";
import { CartProduct } from "@/types/Cart.type";
import { useCartStore } from "@/store/cart.store";

interface Props {
	product: CartProduct;
	handleSelectProduct: (productId: number) => void;
	handleUpdateQuantity: (
		productId: number,
		action: "increase" | "decrease"
	) => void;
	handleDirectQuantity: (valueInput: string, productId: number) => void;
	batchRemoveCartItems: (cartItemIds: number[]) => Promise<void>;
	selectedProducts: CartProduct[];
}

const CartProductItem = ({
	product,
	handleSelectProduct,
	handleUpdateQuantity,
	handleDirectQuantity,
	batchRemoveCartItems,
	selectedProducts,
}: Props) => {
	const { removeProduct } = useCartStore();

	const { productId } = product;

	const handleRemoveProduct = async () => {
		await batchRemoveCartItems([product.id as number]);
		removeProduct(productId);
	};

	return (
		<Card
			radius="lg"
			key={productId}
			className="mb-4 bg-white h-[5.7rem]"
			fullWidth
			shadow="sm"
		>
			<CardBody>
				<div className="grid grid-cols-[1fr_8fr_1fr] gap-2 overflow-hidden">
					<Checkbox
						size="md"
						color="success"
						className="ml-4 max-h-8 mt-3"
						onChange={() => handleSelectProduct(productId)}
						isSelected={selectedProducts.some(
							(selectedProduct) => selectedProduct.id === product.id
						)}
					/>
					<div className="-ml-4 w-full flex flex-col gap-1 text-gray-800">
						<div className="grid grid-cols-[2fr_0.1fr] gap-2">
							<span className="flex gap-4">
								<Image
									src={product.thumbnail}
									alt={product.title}
									className="w-full h-full object-cover rounded-lg border border-gray-400/40"
									width={60}
								/>
								<Link
									className="text-base text-gray-700"
									href={`/products/${product.id}`}
								>
									{product.title}
								</Link>
							</span>
							<div className="flex flex-col items-center justify-center">
								<QuantityModifier
									decrease={() => handleUpdateQuantity(productId, "decrease")}
									increase={() => handleUpdateQuantity(productId, "increase")}
									quantity={product.quantity}
									handleDirectQuantity={(valueInput) => {
										handleDirectQuantity(valueInput, productId);
									}}
								/>
								<Button
									variant="bordered"
									color="danger"
									size="sm"
									className="p-3 max-w-min border-none"
									onPress={handleRemoveProduct}
								>
									<TrashIcon width={20} color="gray" />
								</Button>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-end justify-center text-gray-700">
						<p className="text-sm line-through text-gray-400">
							{formatPriceIDR(product.price * 1000)}
						</p>
						<p className="text-lg font-semibold">
							{formatPriceIDR(
								countDiscountedPrice(
									product.price * 1000,
									product.discountPercentage
								)
							)}
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CartProductItem;
