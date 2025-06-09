import { Card, Skeleton } from "@heroui/react";

const ProductSkeleton = () => {
	return Array.from({ length: 8 }).map((_, i) => (
		<Card
			key={i}
			className="pt-2 bg-white w-full max-w-xs min-w-0 cursor-pointer border border-gray-200 shadow-sm flex flex-col"
			radius="lg"
			shadow="lg"
		>
			<div className="pb-0 gap-1 pt-2 px-4 flex-col items-start">
				<Skeleton className="h-4 w-24 mb-2 rounded bg-gray-200 animate-pulse" />
				<Skeleton className="h-3 w-16 mb-1 rounded bg-gray-200 animate-pulse" />
				<Skeleton className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
			</div>
			<div className="overflow-visible py-2 flex-1 flex items-center justify-center">
				<Skeleton className="object-contain rounded-xl w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] mx-auto bg-gray-200 animate-pulse" />
			</div>
			<div className="flex flex-col gap-0 text-left justify-start w-full px-4 pb-3">
				<Skeleton className="h-5 w-24 mb-1 rounded bg-gray-200 animate-pulse" />
				<Skeleton className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
			</div>
		</Card>
	));
};

export default ProductSkeleton;
