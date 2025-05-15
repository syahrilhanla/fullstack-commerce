"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ProductCatalogue from "@/components/ProductCatalogue";

import { Product } from "@/types/Product.type";
import { useSearchParams } from "next/navigation";
import FilterSection from "@/components/FilterSection";
import { useCategoryStore } from "@/store/category.store";
import { Category } from "@/types/Category.type";

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
	const sortQuery = searchParams?.get("sortBy") || "";
	const orderQuery = searchParams?.get("order") || "";
	const categoryQuery = searchParams?.get("category") || "";

	const { categories } = useCategoryStore();

	const query = useQuery({
		queryKey: ["products", searchQuery, sortQuery, orderQuery, categoryQuery],
		queryFn: () => getProducts(searchQuery, searchParams, categories),
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

const getProducts = async (
	searchQuery: string,
	sParams: URLSearchParams,
	categories: Category[]
) => {
	let baseURL = "https://dummyjson.com/products";
	let completeURL = baseURL;

	const sortBy = sParams.get("sortBy");
	const order = sParams.get("order");
	const category = sParams.get("category");

	// If search query, use search endpoint
	if (searchQuery) {
		completeURL = `${baseURL}/search?q=${encodeURIComponent(searchQuery)}`;
	} else if (category) {
		// If category, use category endpoint
		completeURL = `${baseURL}/category/${encodeURIComponent(category)}`;
	}

	// Add sort and order as query params if present
	const params = new URLSearchParams();
	if (sortBy) params.set("sortBy", sortBy);
	if (order) params.set("order", order);
	// Only add category param if not already used in path
	if (category && !searchQuery) params.set("category", category);

	const urlWithParams = params.toString()
		? `${completeURL}?${params.toString()}`
		: completeURL;

	const response = await fetch(urlWithParams);
	if (!response.ok) throw new Error("Failed to fetch products");
	const data = await response.json();
	return data;
};
