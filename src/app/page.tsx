"use client";

import {
	QueryClient,
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

import ProductCatalogue from "@/components/ProductCatalogue";

import { Product } from "@/types/Product.type";

export default function Home() {
	const queryClass = new QueryClient();

	return (
		<QueryClientProvider client={queryClass}>
			<ChildComponent />
		</QueryClientProvider>
	);
}

const ChildComponent = () => {
	const queryClient = useQueryClient();

	const query = useQuery({ queryKey: ["products"], queryFn: getProducts });

	const { data, isLoading, isError } = query;
	console.log(data, isLoading, isError);

	const products = data?.products as Product[];

	return (
		<>
			<div className="flex flex-col items-center justify-center flex-1 p-4">
				<ProductCatalogue products={products} isLoading={isLoading} />
			</div>
		</>
	);
};

const getProducts = async () => {
	const data = (await fetch("https://dummyjson.com/products")).json();
	return data;
};
