import { Card, CardHeader, CardBody, Skeleton, Divider } from "@heroui/react";

const OrderListSkeleton = () => {
	return (
		<ul className="w-full grid gap-4">
			{[1, 2, 3].map((i) => (
				<Card
					key={i}
					className="w-full mx-auto border-none shadow-lg py-2 overflow-hidden"
				>
					<CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3 lg:py-2 py-1.5">
						<span className="flex items-center gap-2">
							<Skeleton className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
							<Skeleton className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
						</span>
						<Skeleton className="h-4 w-32 rounded bg-gray-200 animate-pulse md:ml-auto mt-1 md:mt-0" />
					</CardHeader>
					<CardBody>
						<div className="grid grid-cols-[1fr_7fr_2fr] gap-2 overflow-hidden">
							<Skeleton className="object-cover rounded-lg w-24 h-24 bg-gray-200 animate-pulse" />
							<div className="flex flex-col gap-2">
								<Skeleton className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
								<Skeleton className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
								<Skeleton className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
							</div>
							<div className="w-full flex text-right items-center">
								<Divider orientation="vertical" className="h-12 mr-4" />
								<div className="w-full flex flex-col items-end gap-2">
									<Skeleton className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
									<Skeleton className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			))}
		</ul>
	);
};

export default OrderListSkeleton;
