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
		<div>
			<h1 className="text-2xl font-bold my-4">Transactions</h1>
			{isLoading && <p className="text-gray-500">Loading transactions...</p>}
			{isError && <p className="text-red-500">Failed to load transactions.</p>}

			{data?.orders && data.orders.length > 0 && (
				<ul className="grid gap-4">
					{data.orders.map((order: Order) => (
						<Card
							key={order.id}
							className="min-w-80 max-w-3xl mx-auto border-none shadow-lg"
						>
							<CardHeader className="flex gap-2">
								<p className="text-xs text-gray-700">
									{formatDate(order.createdAt)}
								</p>
								<StatusChip status={order.orderStatus} />
								<p className="text-xs text-gray-400">{order.externalId}</p>
							</CardHeader>
							<CardBody>
								<div className="grid grid-cols-[2fr_7fr_1fr] gap-2">
									<Image
										src={order.orderItems[0].product.thumbnail}
										height={60}
										width={60}
										alt={order.orderItems[0].product.title}
										className="object-cover rounded-lg w-24 h-24"
										loading="lazy"
									/>

									<div className="grid gap-1">
										<p className="text-lg font-semibold text-gray-800">
											{order.orderItems[0].product.title}
										</p>
										<p>
											{order.orderItems[0].quantity} items x{" "}
											{formatPriceIDR(order.orderItems[0].price)}
										</p>
										{order.orderItems.length > 1 && (
											<p>
												{order.orderItems.length > 1
													? `and ${order.orderItems.length - 1} more items`
													: ""}
											</p>
										)}
									</div>

									<div className="flex gap-0">
										<Divider orientation="vertical" className="hr-10 mr-1" />

										<p className="text-lg font-bold text-gray-800">
											{formatPriceIDR(order.totalPrice)}
										</p>
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
			className="capitalize text-white text-[0.7rem] p-0 h-5"
		>
			{status}
		</Chip>
	);
};
