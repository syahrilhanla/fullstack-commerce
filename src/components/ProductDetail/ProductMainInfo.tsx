import { formatThousandsToK, formatPriceIDR } from "@/helpers/helpers";
import { Product } from "@/types/Product.type";
import { BuildingStorefrontIcon, StarIcon } from "@heroicons/react/16/solid";
import { Button } from "@heroui/react";

interface Props {
	product: Product;
}

const ProductMainInfo = ({ product }: Props) => {
	return (
		<>
			<div className="flex flex-col gap-2">
				<h2 className="text-gray-200 text-xl font-semibold">{product.title}</h2>
				<div className="flex items-center gap-1 text-gray-400 text-sm">
					+
					<span className="text-gray-200 font-semibold">
						{formatThousandsToK(Number((Math.random() * 10000).toFixed(0)))}
					</span>{" "}
					sold
					<small className="text-gray-400 px-2 text-base">•</small>
					<StarIcon width={16} color="orange" />
					<small className="text-sm text-gray-200 font-semibold">
						{product.rating}
					</small>
				</div>
				<h4 className="text-gray-100 text-3xl font-semibold">
					{formatPriceIDR((product.price + product.discountPercentage) * 1000)}
				</h4>
				<hr className="border-gray-800 border-t my-2" />

				<div className="pb-2 grid gap-1.5">
					<div className="text-sm">
						<span className="text-gray-400">Condition:</span>{" "}
						<span className="font-semibold text-gray-100">New</span>
					</div>
					<div className="text-sm">
						<span className="text-gray-400">Min Order Qty:</span>{" "}
						<span className="font-semibold text-gray-100">
							{product.minimumOrderQuantity}
						</span>
					</div>{" "}
					<div className="text-sm">
						<span className="text-gray-400">Warranty:</span>{" "}
						<span className="font-semibold text-gray-100">
							{product.warrantyInformation}
						</span>
					</div>
					<div className="text-sm">
						<span className="text-gray-400">Return Policy:</span>{" "}
						<span className="font-semibold text-gray-100">
							{product.returnPolicy}
						</span>
					</div>
				</div>

				<div className="text-sm text-gray-200">{product.description}</div>

				<hr className="border-gray-800 border-t my-2" />

				<div className="w-full flex items-center text-base justify-between">
					<span className="flex gap-2">
						<BuildingStorefrontIcon width={14} />
						<p className="text-base font-bold text-gray-100">{product.brand}</p>
					</span>
					<Button
						className="text-gray-200 text-sm font-semibold bg-gray-800 hover:bg-gray-700"
						variant="solid"
						color="danger"
						size="sm"
					>
						Follow{" "}
					</Button>
				</div>

				<hr className="border-gray-800 border-t my-2" />

				<div className="flex justify-between text-sm text-gray-400">
					Problem with this product?
					<p>
						⚠{" "}
						<span className="text-gray-100 cursor-pointer font-semibold">
							{" "}
							Report
						</span>
					</p>
				</div>
			</div>
		</>
	);
};

export default ProductMainInfo;
