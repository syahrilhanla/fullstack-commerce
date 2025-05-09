"use client";

import NavbarComponent from "@/components/NavbarComponent";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

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

	console.log(query);
	const { data, isLoading, isError } = query;
	console.log(data, isLoading, isError);

	return (
		<div className="flex flex-col min-h-screen box-border">
			<NavbarComponent />

			<main>
				<div className="flex flex-col items-center justify-center flex-1 p-4"></div>
			</main>
		</div>
	);
};

const getProducts = async () => {
	const data = (await fetch("https://dummyjson.com/products")).json();
	return data;
};
