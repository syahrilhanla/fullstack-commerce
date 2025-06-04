"use client";

import OrderCard from "@/components/Order/OrderCard";
import OrderListSkeleton from "@/components/Order/OrderListSkeleton";
import { useFetchQuery } from "@/helpers/dataQuery";
import { Order } from "@/types/Order.type";

const OrderListPage = () => {
	const { data, isError, isLoading } = useFetchQuery(
		"http://localhost:8000/api/orders/user_orders/",
		["orders"]
	);

	return (
		<div className="flex flex-col items-center justify-center flex-1 p-4">
			<h1 className="text-2xl font-bold my-4 text-left w-full">Transactions</h1>
			{isLoading && <OrderListSkeleton />}
			{isError && <p className="text-red-500">Failed to load transactions.</p>}

			{data?.orders && data.orders.length > 0 && (
				<ul className="grid gap-4">
					{data.orders.map((order: Order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</ul>
			)}
		</div>
	);
};

export default OrderListPage;
