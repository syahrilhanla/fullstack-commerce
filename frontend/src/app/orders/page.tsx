"use client";

import { useFetchQuery } from "@/helpers/dataQuery";
import { formatDate, formatPriceIDR } from "@/helpers/helpers";
import { Order } from "@/types/Order.type";
import {
	Chip,
	Card,
	CardHeader,
	CardBody,
	Image,
	Divider,
} from "@heroui/react";

const OrderListPage = () => {
	const { data, isError, isLoading } = useFetchQuery(
		"http://localhost:8000/api/orders/user_orders/",
		["orders"]
	);

	return (
		<div className="flex flex-col items-center justify-center flex-1 p-4">
			<h1 className="text-2xl font-bold my-4">Transactions</h1>
			{isLoading && <p className="text-gray-500">Loading transactions...</p>}
			{isError && <p className="text-red-500">Failed to load transactions.</p>}

			{data?.orders && data.orders.length > 0 && (
				<ul className="grid gap-4">
					{data.orders.map((order: Order) => (
						<Card
							key={order.id}
							className="lg:w-[60dvw] w-[90dvw] mx-auto border-none shadow-lg py-2"
						>
							<CardHeader className="md:flex grid md:gap-3 gap-1 lg:py-2 py-1.5">
								<span className="flex lg:gap-3 gap-1">
									<p className="text-xs text-gray-700">
										{formatDate(order.createdAt)}
									</p>
									<StatusChip status={order.orderStatus} />
								</span>
								<p className="text-sm text-gray-500/90">{order.externalId}</p>
							</CardHeader>
							<CardBody>
								<div className="grid grid-cols-[1fr_7fr_2fr] gap-2">
									<Image
										src={order.orderItems[0].product.thumbnail}
										height={60}
										width={60}
										alt={order.orderItems[0].product.title}
										className="object-cover rounded-lg w-24 h-24"
									/>

									<div className="flex flex-col gap-1">
										<p className="text-base leading-5 font-semibold text-gray-800">
											{order.orderItems[0].product.title}
										</p>
										<p className="text-xs leading-3 text-gray-500/90">
											{order.orderItems[0].quantity} items x{" "}
											{formatPriceIDR(order.orderItems[0].price)}
										</p>
										{order.orderItems.length > 1 && (
											<p className="mt-1 leading-5 text-xs text-gray-500/90">
												{order.orderItems.length > 1
													? `and ${order.orderItems.length - 1} more items`
													: ""}
											</p>
										)}
									</div>

									<div className="w-full flex text-right">
										<Divider orientation="vertical" className="h-12 mr-4" />

										<div className="w-full flex flex-col items-end">
											<p className="text-xs text-gray-500">Total amount</p>
											<p>{formatPriceIDR(order.totalPrice)}</p>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				</ul>
			)}
		</div>
	);
};

export default OrderListPage;

const StatusChip = ({ status }: { status: string }) => {
	const chipColor = status === "pending" ? "warning" : "success";

	return (
		<Chip
			color={chipColor}
			autoCapitalize="on"
			className="capitalize text-white text-[0.7rem] p-0 h-4"
		>
			{status}
		</Chip>
	);
};
