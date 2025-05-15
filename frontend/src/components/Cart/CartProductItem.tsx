import { formatPriceIDR } from "@/helpers/helpers";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Checkbox, Button, Image } from "@heroui/react";
import Link from "next/link";
import QuantityModifier from "../ProductDetail/QuantityModifier";
import { CartProduct } from "@/types/Cart.type";

interface Props {
	product: CartProduct;
	handleSelectProduct: (productId: number) => void;
	handleUpdateQuantity: (
		productId: number,
		action: "increase" | "decrease"
	) => void;
	handleDirectQuantity: (valueInput: string, productId: number) => void;
	selectedProducts: CartProduct[];
}

const CartProductItem = ({
	product,
	handleSelectProduct,
	handleUpdateQuantity,
	handleDirectQuantity,
	selectedProducts,
}: Props) => {
	return (
		<Card
			radius="lg"
			key={product.id}
			className="mb-4 bg-current h-[5.5rem]"
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
								<Link className="text-base" href={`/products/${product.id}`}>
									{product.title}
								</Link>
							</span>
							<div className="flex flex-col items-center justify-center">
								<QuantityModifier
									decrease={() => handleUpdateQuantity(product.id, "decrease")}
									increase={() => handleUpdateQuantity(product.id, "increase")}
									quantity={product.quantity}
									handleDirectQuantity={(valueInput) => {
										handleDirectQuantity(valueInput, product.id);
									}}
								/>
								<Button
									variant="bordered"
									color="danger"
									size="sm"
									className="p-3 max-w-min border-none"
								>
									<TrashIcon width={20} color="gray" />
								</Button>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-end justify-center text-gray-200">
						<p className="text-sm line-through text-gray-500">
							{formatPriceIDR(product.price * 1000)}
						</p>
						<p className="text-lg font-semibold">
							{formatPriceIDR(
								product.price * 1000 * (1 - product.discountPercentage / 100)
							)}
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CartProductItem;
