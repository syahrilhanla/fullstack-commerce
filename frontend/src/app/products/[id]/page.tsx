"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";

import ProductMainInfo from "@/components/ProductDetail/ProductMainInfo";
import ProductProcess from "@/components/ProductDetail/ProductProcess";
import ProductReview from "@/components/ProductDetail/ProductReview";
import ProductDetailSkeleton from "@/components/ProductCatalogue/ProductDetailSkeleton";
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
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`
			);
			const reviewResponse = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/?product_id=${id}`
			);

			if (!productResponse.ok || !reviewResponse.ok) {
				throw new Error("Failed to fetch product");
			}

			const reviews = (await reviewResponse.json()).results;

			return {
				...(await productResponse.json()),
				reviews,
			} as Product;
		},
	});

	if (isLoading) return <ProductDetailSkeleton />;
	if (isError) return <div>Error loading product</div>;

	return (
		<>
			{!isLoading && product && (
				<>
					<div className="max-w-[80dvw] grid grid-flow-row xl:grid-flow-col md:grid-cols-1 xl:grid-cols-3 gap-4 p-4">
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
