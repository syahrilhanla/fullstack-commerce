"use client";

import { Product } from "@/types/Product.type";
import ProductCatalogueCard from "./ProductCatalogueCard";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductSkeleton from "./ProductSkeleton";

interface Props {
	products: Product[];
	isLoading: boolean;
	count: number;
	fetchNext: () => void;
}

const ProductCatalogue = ({ products, isLoading, count, fetchNext }: Props) => {
	const [hasMore, setHasMore] = useState(true);

	return (
		<div
			// id="product-list"
			className="md:min-w-[50dvw] min-w-[80dvw] w-full mt-4 px-2 duration-300 overflow-x-visible"
		>
			<h2 className="text-lg text-gray-700 col-span-full">
				Based on your search
			</h2>
			<InfiniteScroll
				dataLength={products ? products.length + 20 : 0}
				scrollThreshold={"100%"}
				next={() => {
					if (products.length >= count) {
						setHasMore(false);
					} else {
						fetchNext();
					}
				}}
				className="w-full grid gap-4
						grid-cols-1
						sm:grid-cols-2
						lg:grid-cols-3
						xl:grid-cols-4
						2xl:grid-cols-5"
				hasMore={hasMore}
				loader={<ProductSkeleton />}
				endMessage={
					<p className="text-gray-500 col-span-full text-center">
						You have seen all products.
					</p>
				}
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
			</InfiniteScroll>
		</div>
	);
};

export default ProductCatalogue;
