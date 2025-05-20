"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ProductCatalogue from "@/components/ProductCatalogue";

import { useSearchParams } from "next/navigation";
import FilterSection from "@/components/FilterSection";
import { Product } from "@/types/Product.type";

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

	const query = useQuery({
		queryKey: ["products", searchQuery, sortQuery, orderQuery, categoryQuery],
		queryFn: () => getProducts(searchQuery, searchParams),
		enabled: !!searchParams, // Prevent query execution if searchParams is null
	});

	if (!searchParams) {
		onNotFound();
		return null;
	}

	const { data: products, isLoading, isError } = query;

	return (
		<div className="flex flex-col items-center justify-center flex-1 p-4">
			<FilterSection />

			{isError ? (
				<>
					<div className="text-red-500">
						<p>Something went wrong while fetching products.</p>
					</div>
				</>
			) : (
				<ProductCatalogue products={products || []} isLoading={isLoading} />
			)}
		</div>
	);
}

const getProducts = async (searchQuery: string, sParams: URLSearchParams) => {
	const baseURL = "http://localhost:8000/api/products/";

	const sortBy = sParams.get("sortBy");
	const order = sParams.get("order");
	const category = sParams.get("category");

	// Add sort and order as query params if present
	const params = new URLSearchParams();

	if (searchQuery) params.set("search", searchQuery);
	if (sortBy) params.set("ordering", `${order === "desc" ? "-" : ""}${sortBy}`);
	if (category) params.set("category", category);

	const urlWithParams = params.toString()
		? `${baseURL}?${params.toString()}`
		: baseURL;

	const response = await fetch(urlWithParams);
	if (!response.ok) throw new Error("Failed to fetch products");
	const data = await response.json();
	return data as Product[];
};
