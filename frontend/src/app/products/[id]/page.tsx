"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";

import ProductMainInfo from "@/components/ProductDetail/ProductMainInfo";
import ProductProcess from "@/components/ProductDetail/ProductProcess";
import ProductReview from "@/components/ProductDetail/ProductReview";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import ProductPreview from "@/components/ProductDetail/ProductPreview";

import { Product } from "@/types/Product.type";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

const ProductDetail = ({ params }: Props) => {
	// Unwrap the params object using React's `use` hook
	const { id } = use(params);

	const {
		data: product,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			const productResponse = await fetch(
				`http://localhost:8000/api/products/${id}`
			);
			const reviewResponse = await fetch(
				`http://localhost:8000/api/reviews/?product_id=${id}`
			);

			if (!productResponse.ok || !reviewResponse.ok) {
				throw new Error("Failed to fetch product");
			}

			return {
				...(await productResponse.json()),
				reviews: await reviewResponse.json(),
			} as Product;
		},
	});

	if (isLoading) return <ProductDetailSkeleton />;
	if (isError) return <div>Error loading product</div>;

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
