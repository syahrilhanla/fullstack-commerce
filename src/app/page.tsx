"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ProductCatalogue from "@/components/ProductCatalogue";

import { Product } from "@/types/Product.type";
import { useSearchParams } from "next/navigation";
import FilterSection from "@/components/FilterSection";

export default function Home() {
	const router = useRouter();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<HomeContent onNotFound={() => router.push("/404")} />
		</Suspense>
	);
}

function HomeContent({ onNotFound }: { onNotFound: () => void }) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams?.get("search") || "";

	const query = useQuery({
		queryKey: ["products", searchQuery],
		queryFn: () => getProducts(searchQuery),
		enabled: !!searchParams, // Prevent query execution if searchParams is null
	});

	if (!searchParams) {
		onNotFound();
		return null;
	}

	const { data, isLoading } = query;
	const products = data?.products as Product[];

	return (
		<div className="flex flex-col items-center justify-center flex-1 p-4">
			<FilterSection />

			<ProductCatalogue products={products} isLoading={isLoading} />
		</div>
	);
}

const getProducts = async (searchQuery: string) => {
	const url = searchQuery
		? `https://dummyjson.com/products/search?q=${searchQuery}` // Search endpoint
		: "https://dummyjson.com/products"; // Default endpoint

	const data = (await fetch(url)).json();
	return data;
};
