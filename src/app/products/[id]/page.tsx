"use client";

import ProductMainInfo from "@/components/ProductDetail/ProductMainInfo";
import ProductProcess from "@/components/ProductDetail/ProductProcess";
import ProductReview from "@/components/ProductDetail/ProductReview";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { Product } from "@/types/Product.type";
import { Image } from "@heroui/react";
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
						<div className="mr-12">
							<Image
								src={product?.images[0]}
								alt={product.title}
								className="w-full h-full object-cover rounded-lg"
								width={700}
								height={700}
							/>
							<div className="flex">
								{product?.images.map((image, index) => (
									<Image
										key={index}
										src={image}
										alt={product.title}
										className={`w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${
											index === 0 ? "border-2 border-gray-200" : ""
										}`}
										width={60}
										height={60}
									/>
								))}
							</div>
						</div>

						{/* main info */}
						<ProductMainInfo product={product} />

						{/* cart and payment info */}
						<ProductProcess product={product} />
					</div>

					<ProductReview product={product} />
				</div>
			)}
		</>
	);
};

export default ProductDetail;
