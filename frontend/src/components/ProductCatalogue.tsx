import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter, Image } from "@heroui/react";
import { BuildingStorefrontIcon, StarIcon } from "@heroicons/react/16/solid";

import ProductSkeleton from "./ProductSkeleton";

import { formatPriceIDR, formatThousandsToK } from "@/helpers/helpers";

import { Product } from "@/types/Product.type";

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
					<Link
						href={`/products/${product.id}`}
						key={product.id}
						className="flex justify-center"
					>
						<Card
							id={String(product.id)}
							className="pt-2 bg-white w-full max-w-56 min-w-0 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out border border-gray-200 shadow-sm flex flex-col"
							radius="lg"
							shadow="lg"
						>
							<CardHeader className="pb-0 gap-1 pt-2 px-4 flex-col items-start">
								<span className="flex items-center gap-2 text-gray-600">
									{product.category !== "groceries" ? (
										<BuildingStorefrontIcon
											width={16}
											className="text-gray-500"
										/>
									) : null}
									<p className="text-tiny uppercase font-bold">
										{product.brand}
									</p>
								</span>
								<small className="text-gray-500 capitalize">
									{product.category}
								</small>
								<h4 className="font-bold text-sm max-w-full line-clamp-1 text-gray-700">
									{product.title}
								</h4>
							</CardHeader>
							<CardBody className="overflow-visible py-2 flex-1 flex items-center justify-center">
								<Image
									alt="Card background"
									className="object-contain rounded-xl w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] mx-auto"
									src={product.thumbnail}
									width={120}
									height={120}
								/>
							</CardBody>
							<CardFooter>
								<div className="flex flex-col gap-0 text-left justify-start w-full">
									<p className="text-gray-800 text-pretty text-base font-bold">
										{formatPriceIDR(product.price * 1000)}
										<span className="text-xs text-gray-400 line-through ml-2 ">
											{formatPriceIDR(
												(product.price + product.discountPercentage) * 1000
											)}
										</span>
									</p>
									<div className="flex gap-1 text-gray-500 items-center text-base">
										<StarIcon width={16} color="gold" />
										<small className="">{product.rating}</small>
										<small className="text-gray-400 ">•</small>
										<small className="">
											+
											{formatThousandsToK(
												Number((Math.random() * 10000).toFixed(0))
											)}{" "}
											sold
										</small>
									</div>
								</div>
							</CardFooter>
						</Card>
					</Link>
				))}
		</div>
	);
};

export default ProductCatalogue;
