"use client";

import ProductSkeleton from "./ProductSkeleton";

import { Product } from "@/types/Product.type";
import ProductCatalogueCard from "./ProductCatalogueCard";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
	products: Product[];
	isLoading: boolean;
	count: number;
}

const PAGE_SIZE = 20;

const ProductCatalogue = ({ products, isLoading, count }: Props) => {
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	return (
		<div className="md:min-w-[50dvw] min-w-[80dvw] w-full mt-4 px-2 duration-300">
			<h2 className="text-lg text-gray-700 col-span-full">
				Based on your search
			</h2>
			{isLoading && <ProductSkeleton />}

			<InfiniteScroll
				dataLength={count || products.length}
				next={() => {
					if (products.length < PAGE_SIZE) {
						setHasMore(false);
					} else {
						setPage((prev) => prev + 1);
					}
				}}
				hasMore={!isLoading && hasMore && products.length >= PAGE_SIZE}
				loader={
					<div
						className="w-full mt-4 grid gap-4
						grid-cols-1
						sm:grid-cols-2
						lg:grid-cols-3
						xl:grid-cols-4
						2xl:grid-cols-5"
					>
						<ProductSkeleton />
					</div>
				}
				endMessage={
					<p className="text-gray-500 col-span-full text-center">
						You have seen all products.
					</p>
				}
			>
				<div
					className="w-full grid gap-4
						grid-cols-1
						sm:grid-cols-2
						lg:grid-cols-3
						xl:grid-cols-4
						2xl:grid-cols-5"
				>
					{!isLoading && products?.length === 0 && (
						<p className="text-gray-500 col-span-full text-center">
							No products found. Try adjusting your search criteria.
						</p>
					)}
					{!isLoading &&
						products?.length > 0 &&
						products.map((product) => (
							<ProductCatalogueCard key={product.id} product={product} />
						))}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default ProductCatalogue;
