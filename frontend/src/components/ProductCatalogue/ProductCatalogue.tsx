import ProductSkeleton from "./ProductSkeleton";

import { Product } from "@/types/Product.type";
import ProductCatalogueCard from "./ProductCatalogueCard";

interface Props {
	products: Product[];
	isLoading: boolean;
}

const ProductCatalogue = ({ products, isLoading }: Props) => {
	return (
		<div
			className="md:min-w-[50dvw] min-w-[80dvw] w-full grid gap-x-4 gap-y-4 mt-4
			grid-cols-1
			sm:grid-cols-2
			lg:grid-cols-3
			xl:grid-cols-4
			2xl:grid-cols-5
			px-2 duration-300
		"
		>
			<h2 className="text-lg text-gray-700 col-span-full">
				Based on your search
			</h2>
			{isLoading && <ProductSkeleton />}

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
	);
};

export default ProductCatalogue;
