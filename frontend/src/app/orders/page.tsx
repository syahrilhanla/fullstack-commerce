"use client";

import { useFetchQuery } from "@/helpers/dataQuery";
import { formatDate } from "@/helpers/helpers";
import { useUserInfoStore } from "@/store/userInfo.store";
import { Order } from "@/types/Order.type";
import { Chip, Card, CardHeader } from "@heroui/react";

const OrderListPage = () => {
	const { userInfo } = useUserInfoStore();

	const { data, isError, isLoading } = useFetchQuery(
		"http://localhost:8000/api/orders/?user" + userInfo?.id,
		["orders"]
	);

	return (
		<div>
			<h1 className="text-2xl font-bold my-4">Transactions</h1>
			<p className="text-gray-600 mb-4">
				Here you can view all your transactions.
			</p>
			{isLoading && <p className="text-gray-500">Loading transactions...</p>}
			{isError && <p className="text-red-500">Failed to load transactions.</p>}

			{data && data.length > 0 && (
				<ul className="grid gap-4">
					{data.map((order: Order) => (
						<Card className="min-w-80 max-w-3xl mx-auto border-none shadow-lg">
							<CardHeader className="flex gap-2">
								<p className="text-xs text-gray-700">
									{formatDate(order.createdAt)}
								</p>
								<StatusChip status="paid" />
								<p className="text-xs text-gray-400">{order.externalId}</p>
							</CardHeader>
						</Card>
					))}
				</ul>
			)}
		</div>
	);
};

export default OrderListPage;

const StatusChip = ({ status }: { status: string }) => {
	switch (status) {
		case "pending":
			return <Chip color="warning">Pending</Chip>;
		case "paid":
			return (
				<Chip
					color="success"
					className="text-white px-1 py-0 text-[0.7rem]"
					size="sm"
				>
					Paid
				</Chip>
			);
		default:
			return <span className="text-gray-500">Unknown</span>;
	}
};
