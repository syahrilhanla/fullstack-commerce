"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";

import ProductMainInfo from "@/components/ProductDetail/ProductMainInfo";
import ProductPreview from "@/components/ProductDetail/ProductPreview";
import ProductProcess from "@/components/ProductDetail/ProductProcess";
import ProductReview from "@/components/ProductDetail/ProductReview";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { Product } from "@/types/Product.type";

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
				<>
					<div className="max-w-[80dvw] grid grid-flow-col grid-cols-3 p-4">
						{/* image section */}
						<ProductPreview product={product} />

						{/* main info */}
						<ProductMainInfo product={product} />

						{/* cart and payment info */}
						<ProductProcess product={product} />
					</div>

					<ProductReview product={product} />
				</>
			)}
		</>
	);
};

export default ProductDetail;
