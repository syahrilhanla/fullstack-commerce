"use client";

import {
	formatThousandsToK,
	formatPriceIDR,
	countDiscountedPrice,
} from "@/helpers/helpers";
import { Product } from "@/types/Product.type";
import { BuildingStorefrontIcon, StarIcon } from "@heroicons/react/16/solid";
import { Button } from "@heroui/react";

interface Props {
	product: Product;
}

const ProductMainInfo = ({ product }: Props) => {
	return (
		<div className="flex flex-col gap-2 px-2 sm:px-0 w-full max-w-2xl mx-auto">
			<h2 className="text-gray-700 text-base sm:text-xl font-semibold break-words">
				{product.title}
			</h2>
			<div className="flex flex-wrap items-center gap-1 text-gray-600 text-xs sm:text-sm">
				+
				<span className="text-gray-700 font-semibold">
					{formatThousandsToK(Number((Math.random() * 10000).toFixed(0)))}
				</span>{" "}
				sold
				<small className="text-gray-400 px-2 text-xs sm:text-base">•</small>
				<StarIcon width={16} color="orange" />
				<small className="text-xs sm:text-sm text-gray-700 font-semibold">
					{product.rating}
				</small>
			</div>
			<h4 className="text-gray-700 text-lg sm:text-2xl font-semibold">
				{formatPriceIDR(
					countDiscountedPrice(product.price * 1000, product.discountPercentage)
				)}
			</h4>
			<h5 className="ml-2 flex items-center gap-2">
				<span className="p-1 text-xs rounded-lg text-red-800 font-semibold bg-red-100">
					{product.discountPercentage.toFixed()}%
				</span>
				<small className="line-through text-gray-500 text-xs sm:text-sm">
					{formatPriceIDR(product.price * 1000)}
				</small>
			</h5>
			<hr className="border-gray-200 border-t my-2" />

			<div className="pb-2 grid gap-1.5">
				<div className="text-xs sm:text-sm">
					<span className="text-gray-600">Condition:</span>{" "}
					<span className="font-semibold text-gray-700">New</span>
				</div>
				<div className="text-xs sm:text-sm">
					<span className="text-gray-600">Min Order Qty:</span>{" "}
					<span className="font-semibold text-gray-700">
						{product.minimumOrderQuantity}
					</span>
				</div>{" "}
				<div className="text-xs sm:text-sm">
					<span className="text-gray-600">Warranty:</span>{" "}
					<span className="font-semibold text-gray-700">
						{product.warrantyInformation}
					</span>
				</div>
				<div className="text-xs sm:text-sm">
					<span className="text-gray-600">Return Policy:</span>{" "}
					<span className="font-semibold text-gray-700">
						{product.returnPolicy}
					</span>
				</div>
			</div>

			<div className="text-xs sm:text-sm text-gray-700 break-words">
				{product.description}
			</div>

			<hr className="border-gray-200 border-t my-2" />

			<div className="w-full flex flex-row items-center text-xs sm:text-base justify-between gap-2">
				<span className="flex gap-2 items-center">
					<BuildingStorefrontIcon width={14} />
					<p className="text-xs sm:text-base font-bold text-gray-700">
						{product.brand}
					</p>
				</span>
				<Button
					className="text-gray-700 text-xs sm:text-sm font-semibold bg-gray-200 hover:bg-gray-300 px-4 py-1"
					variant="solid"
					color="danger"
					size="sm"
				>
					Follow
				</Button>
			</div>

			<hr className="border-gray-200 border-t my-2" />

			<div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 gap-1">
				<span>Problem with this product?</span>
				<p>
					⚠{" "}
					<span className="text-gray-700 cursor-pointer font-semibold">
						Report
					</span>
				</p>
			</div>
		</div>
	);
};

export default ProductMainInfo;
