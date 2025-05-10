"use client";

import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { formatPriceIDR, formatThousandsToK } from "@/helpers/helpers";
import { Product } from "@/types/Product.type";
import { BuildingStorefrontIcon, StarIcon } from "@heroicons/react/16/solid";
import { Button, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

const ProductDetail = ({ params }: Props) => {
	// Unwrap the params object using React's `use` hook
	const { id } = use(params);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			const response = await fetch(`https://dummyjson.com/products/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch product");
			}
			return response.json();
		},
	});

	if (isLoading) return <ProductDetailSkeleton />;
	if (isError) return <div>Error loading product</div>;

	const product = data as Product;

	return (
		<>
			{!isLoading && product && (
				<div className="flex flex-col items-center justify-center flex-1 px-48">
					<div className="max-w-[80dvw] grid grid-flow-col grid-cols-3 p-4">
						{/* image section */}
						<div className="px-12">
							<Image
								src={product?.images[0]}
								alt={product.title}
								className="w-full h-full object-cover rounded-lg"
								width={700}
								height={700}
								// loading="lazy"
							/>
						</div>

						{/* main info */}
						<div className="flex flex-col gap-2">
							<h2 className="text-gray-200 text-xl font-semibold">
								{product.title}
							</h2>
							<div className="flex items-center gap-1 text-gray-400 text-sm">
								+
								<span className="text-gray-200 font-semibold">
									{formatThousandsToK(
										Number((Math.random() * 10000).toFixed(0))
									)}
								</span>{" "}
								sold
								<small className="text-gray-400 px-2 text-base">•</small>
								<StarIcon width={16} color="yellow" />
								<small className="text-sm text-gray-200 font-semibold">
									{product.rating}
								</small>
							</div>
							<h4 className="text-gray-100 text-3xl font-semibold">
								{formatPriceIDR(
									(product.price + product.discountPercentage) * 1000
								)}
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
									<p className="text-base font-bold text-gray-100">
										{product.brand}
									</p>
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

						{/* cart and payment info */}
						<div></div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProductDetail;
