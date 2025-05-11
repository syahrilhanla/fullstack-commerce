import { Card, Skeleton } from "@heroui/react";

const ProductDetailSkeleton = () => {
	return (
		<div className="w-full flex flex-col justify-center items-center p-4">
			<Card
				className="xl:w-[50dvw] w-[80dvw] space-y-5 p-4 bg-current duration-300"
				radius="lg"
			>
				<div className="flex gap-3">
					<Skeleton className="h-48 w-72 rounded-xl" />
					<div className="w-full flex flex-col gap-4">
						<Skeleton className="h-1/5 w-full rounded-xl" />
						<Skeleton className="h-1/5 w-full rounded-xl" />
						<Skeleton className="h-1/5 w-full rounded-xl" />
						<Skeleton className="h-1/5 w-full rounded-xl" />
						<Skeleton className="h-1/5 w-full rounded-xl" />
					</div>
				</div>
				<div className="w-full flex flex-col gap-4">
					<Skeleton className="h-6 w-full rounded-xl" />
					<Skeleton className="h-6 w-full rounded-xl" />
					<Skeleton className="h-6 w-full rounded-xl" />
				</div>
			</Card>
		</div>
	);
};

export default ProductDetailSkeleton;
