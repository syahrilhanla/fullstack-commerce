import { Card, Skeleton } from "@heroui/react";

const ProductSkeleton = () => {
	return [1, 2, 3, 4, 5].map((i) => (
		<Card
			key={i}
			className="w-[200px] space-y-5 p-4 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
			radius="lg"
		>
			<Skeleton className="rounded-lg bg-gray-200 animate-pulse">
				<div className="h-24 rounded-lg bg-gray-200" />
			</Skeleton>
			<div className="space-y-3">
				<Skeleton className="w-3/5 rounded-lg bg-gray-200 animate-pulse">
					<div className="h-3 w-3/5 rounded-lg bg-gray-200" />
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg bg-gray-200 animate-pulse">
					<div className="h-3 w-4/5 rounded-lg bg-gray-200" />
				</Skeleton>
				<Skeleton className="w-2/5 rounded-lg bg-gray-200 animate-pulse">
					<div className="h-3 w-2/5 rounded-lg bg-gray-200" />
				</Skeleton>
			</div>
		</Card>
	));
};

export default ProductSkeleton;
