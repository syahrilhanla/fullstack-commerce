"use client";

import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
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

	console.log(data);

	return <>product detail</>;
};

export default ProductDetail;
