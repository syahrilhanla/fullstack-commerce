import { BuildingStorefrontIcon, StarIcon } from "@heroicons/react/16/solid";
import { Card, CardHeader, CardBody, Image, CardFooter } from "@heroui/react";
import ProductSkeleton from "./ProductSkeleton";
import { Product } from "@/types/Product.type";
import { formatPriceIDR } from "@/helpers/formatPriceIDR";

interface Props {
	products: Product[];
	isLoading: boolean;
}

const ProductCatalogue = ({ products, isLoading }: Props) => {
	return (
		<div className="grid gap-x-4 gap-y-4 px-28 py-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
			<h2 className="mb-4 text-lg text-gray-200 col-span-5">
				Based on your search
			</h2>
			{isLoading && <ProductSkeleton />}

			{!isLoading &&
				products?.length &&
				products.map((product) => (
					<Card id={String(product.id)} className="pt-2 bg-current max-w-48">
						<CardHeader className="pb-0 gap-1 pt-2 px-4 flex-col items-start">
							<span className="flex items-center gap-2 text-gray-400">
								<BuildingStorefrontIcon width={14} />
								<p className="text-tiny uppercase font-bold">{product.brand}</p>
							</span>
							<small className="text-gray-500 capitalize">
								{product.category}
							</small>
							<h4 className="font-bold text-sm max-w-full line-clamp-1 text-gray-200">
								{product.title}
							</h4>
						</CardHeader>
						<CardBody className="overflow-visible py-2">
							<div className="flex justify-center">
								<Image
									alt="Card background"
									className="object-fill rounded-xl"
									src={product.thumbnail}
									width={120}
								/>
							</div>
						</CardBody>
						<CardFooter>
							<div className="flex flex-col gap-1 text-left justify-start w-full">
								<p className=" text-gray-200 text-pretty text-base">
									{formatPriceIDR(product.price * 1000)}
									<span className="text-xs text-gray-400 line-through ml-2">
										{formatPriceIDR(
											(product.price + product.discountPercentage) * 1000
										)}
									</span>
								</p>
								<div className="flex gap-1 text-gray-200">
									<StarIcon width={16} color="yellow" />
									<small>{product.rating}</small>
								</div>
							</div>
						</CardFooter>
					</Card>
				))}
		</div>
	);
};

export default ProductCatalogue;
