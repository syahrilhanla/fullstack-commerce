import { Product } from "@/types/Product.type";
import { StarIcon } from "@heroicons/react/16/solid";
import {
	Card,
	CardHeader,
	CardBody,
	Image,
	Skeleton,
	CardFooter,
} from "@heroui/react";

interface Props {
	products: Product[];
	isLoading: boolean;
}

const ProductCatalogue = ({ products, isLoading }: Props) => {
	return (
		<div className="grid gap-x-4 gap-y-4 px-28 py-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<h2 className="mb-4 text-lg text-gray-200 col-span-4">
				Based on your search
			</h2>
			{isLoading &&
				[1, 2, 3, 4].map((i) => (
					<Card
						id={String(i)}
						className="w-[200px] space-y-5 p-4 bg-current"
						radius="lg"
					>
						<Skeleton className="rounded-lg">
							<div className="h-24 rounded-lg bg-current" />
						</Skeleton>
						<div className="space-y-3">
							<Skeleton className="w-3/5 rounded-lg">
								<div className="h-3 w-3/5 rounded-lg bg-current" />
							</Skeleton>
							<Skeleton className="w-4/5 rounded-lg">
								<div className="h-3 w-4/5 rounded-lg bg-current" />
							</Skeleton>
							<Skeleton className="w-2/5 rounded-lg">
								<div className="h-3 w-2/5 rounded-lg bg-current" />
							</Skeleton>
						</div>
					</Card>
				))}

			{!isLoading &&
				products?.length &&
				products.map((product) => (
					<Card id={String(product.id)} className="pt-2 bg-current max-w-48">
						<CardHeader className="pb-0 pt-2 px-4 flex-col items-start text-gray-200">
							<p className="text-tiny uppercase font-bold">{product.brand}</p>
							<small>{product.category}</small>
							<h4 className="font-bold text-sm truncate max-w-full line-clamp-2">
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
							<div className="flex flex-col text-left justify-start w-full">
								<p className="font-bold text-gray-200">
									Rp{" "}
									{(product.price * 1000).toLocaleString("id-ID", {
										currency: "IDR",
									})}
									<span className="text-xs text-gray-400 line-through ml-2">
										Rp
										{(
											(product.price + product.discountPercentage) *
											1000
										).toLocaleString("id-ID", {})}
									</span>
								</p>
								<div className="flex gap-1 text-gray-200">
									<StarIcon width={16} color="yellow" />
									{product.rating}
								</div>
							</div>
						</CardFooter>
					</Card>
				))}
		</div>
	);
};

export default ProductCatalogue;
