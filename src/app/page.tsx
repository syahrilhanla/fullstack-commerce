"use client";

import { useQuery } from "@tanstack/react-query";

import ProductCatalogue from "@/components/ProductCatalogue";

import { Product } from "@/types/Product.type";
import { useSearchParams } from "next/navigation";

export default function Home() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	const query = useQuery({
		queryKey: ["products", searchQuery],
		queryFn: () => getProducts(searchQuery),
	});

	const { data, isLoading } = query;

	const products = data?.products as Product[];

	return (
		<>
			<div className="flex flex-col items-center justify-center flex-1 p-4">
				<ProductCatalogue products={products} isLoading={isLoading} />
			</div>
		</>
	);
}

const getProducts = async (searchQuery: string) => {
	const url = searchQuery
		? `https://dummyjson.com/products/search?q=${searchQuery}` // Search endpoint
		: "https://dummyjson.com/products"; // Default endpoint

	const data = (await fetch(url)).json();
	return data;
};
