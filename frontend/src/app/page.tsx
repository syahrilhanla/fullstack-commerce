"use client";

import { Suspense } from "react";

import ProductCatalogue from "@/components/ProductCatalogue/ProductCatalogue";

import { useSearchParams } from "next/navigation";
import FilterSection from "@/components/Navbar/FilterSection";
import { Product } from "@/types/Product.type";
import AppDisclaimerModal from "@/components/AppDisclaimerModal";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Home() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AppDisclaimerModal />

			<HomeContent />
		</Suspense>
	);
}

function HomeContent() {
	const searchParams = useSearchParams();

	const searchQuery = searchParams?.get("search") || "";
	const sortQuery = searchParams?.get("sortBy") || "";
	const orderQuery = searchParams?.get("order") || "";
	const categoryQuery = searchParams?.get("category") || "";

	const fetchProducts = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const sParams = new URLSearchParams();
		sParams.set("search", searchQuery);
		sParams.set("sortBy", sortQuery);
		sParams.set("order", orderQuery);
		sParams.set("category", categoryQuery);
		if (pageParam) {
			sParams.set("page", pageParam.toString());
		}

		const { results, count, next } = await getProducts(sParams);

		return {
			data: results,
			count,
			currentPage: pageParam,
			nextPage: next ? pageParam + 1 : undefined,
		};
	};

	const { data, error, fetchNextPage, isPending } = useInfiniteQuery({
		queryKey: ["products", searchQuery, sortQuery, orderQuery, categoryQuery],
		queryFn: fetchProducts,
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextPage,
	});

	const products = data?.pages.flatMap((page) => page.data) || [];

	return (
		<div className="flex flex-col items-center justify-center flex-1 p-4">
			<FilterSection />

			{error ? (
				<>
					<div className="text-red-500">
						<p>Something went wrong while fetching products.</p>
					</div>
				</>
			) : (
				<ProductCatalogue
					products={products || []}
					count={data?.pages[0]?.count || 0}
					isLoading={isPending}
					fetchNext={fetchNextPage}
				/>
			)}
		</div>
	);
}

const getProducts = async (sParams: URLSearchParams) => {
	const baseURL = "http://localhost:8000/api/products/";

	const sortBy = sParams.get("sortBy");
	const order = sParams.get("order");
	const category = sParams.get("category");
	const searchQuery = sParams.get("search");
	const page = sParams.get("page") || "1";

	// Add sort and order as query params if present
	const params = new URLSearchParams();

	if (searchQuery) params.set("search", searchQuery);
	if (sortBy) params.set("ordering", `${order === "desc" ? "-" : ""}${sortBy}`);
	if (category) params.set("category", category);
	if (page) params.set("page", page);

	const urlWithParams = params.toString()
		? `${baseURL}?${params.toString()}`
		: baseURL;

	const response = await fetch(urlWithParams);
	if (!response.ok) throw new Error("Failed to fetch products");
	const data = await response.json();
	return {
		results: data.results as Product[],
		count: data.count,
		next: data.next,
		previous: data.previous,
	};
};
