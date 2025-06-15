"use client";

import OrderCard from "@/components/Order/OrderCard";
import OrderListSkeleton from "@/components/Order/OrderListSkeleton";
import FilterButtonSkeleton from "@/components/Order/FilterButtonSkeleton";
import { useFetchQuery } from "@/helpers/dataQuery";
import { useUserInfoStore } from "@/store/userInfo.store";
import { Image } from "@heroui/react";
import { useState } from "react";

const OrderListPage = () => {
	const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

	const { userInfo } = useUserInfoStore();
	const { data, isError, isLoading } = useFetchQuery(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user_orders/`,
		["orders"]
	);

	const total = data?.orders.length || 0;
	const paid =
		data?.orders.filter((order: any) => order.orderStatus === "paid").length ||
		0;
	const pending =
		data?.orders.filter((order: any) => order.orderStatus === "pending")
			.length || 0;

	return (
		<div className="relative py-4 flex flex-col lg:flex-row gap-8 w-full">
			{/* Left column: User info */}
			<aside className="md:w-1/3 w-full bg-white rounded-xl shadow p-6 flex flex-col items-center mb-6 md:mb-0 border border-gray-100 md:sticky md:top-6 self-start">
				{userInfo && (
					<>
						<Image
							src="https://images.tokopedia.net/img/cache/300/tPxBYm/2023/1/20/00d6ff75-2a9e-4639-9f11-efe55dcd0885.jpg"
							alt="avatar"
							className="w-20 h-20 rounded-full border mb-3 object-cover"
						/>
						<div className="text-center w-full">
							<p className="font-semibold text-lg text-gray-800">
								{userInfo.name}
							</p>
							<p className="text-sm text-gray-500 mb-1 break-all">
								{userInfo.email}
							</p>
							{userInfo.phone && (
								<p className="text-sm text-gray-500 mb-1 break-all">
									{userInfo.phone}
								</p>
							)}
						</div>
					</>
				)}
			</aside>

			{/* Right column: Transactions */}
			<main className="lg:w-2/3 w-full flex flex-col">
				<h1 className="text-2xl font-bold">Transactions</h1>
				<section className="flex gap-2 text-sm mb-8 flex-wrap justify-center md:justify-start">
					{isLoading ? (
						<FilterButtonSkeleton />
					) : (
						<>
							<button
								type="button"
								className={`flex flex-col items-center rounded-lg px-4 py-2 shadow-sm min-w-[90px] border transition-all duration-150 focus:outline-none
            ${
							filter === "all"
								? "bg-primary-100 ring-2 ring-primary-400 scale-105"
								: "bg-white hover:bg-primary-50"
						}`}
								onClick={() => setFilter("all")}
							>
								<span className="text-[11px] text-gray-500 font-medium mb-0.5 uppercase tracking-wide">
									Total
								</span>
								<span className="text-lg font-bold text-primary-700 leading-tight">
									{total}
								</span>
							</button>
							<button
								type="button"
								className={`flex flex-col items-center rounded-lg px-4 py-2 shadow-sm min-w-[90px] border transition-all duration-150 focus:outline-none
            ${
							filter === "paid"
								? "bg-green-100 ring-2 ring-green-300 scale-105"
								: "bg-white hover:bg-green-50"
						}`}
								onClick={() => setFilter("paid")}
							>
								<span className="text-[11px] text-gray-500 font-medium mb-0.5 uppercase tracking-wide">
									Paid
								</span>
								<span className="text-lg font-bold text-green-700 leading-tight">
									{paid}
								</span>
							</button>
							<button
								type="button"
								className={`flex flex-col items-center rounded-lg px-4 py-2 shadow-sm min-w-[90px] border transition-all duration-150 focus:outline-none
            ${
							filter === "pending"
								? "bg-yellow-100 ring-2 ring-yellow-300 scale-105"
								: "bg-white hover:bg-yellow-50"
						}`}
								onClick={() => setFilter("pending")}
							>
								<span className="text-[11px] text-gray-500 font-medium mb-0.5 uppercase tracking-wide">
									Pending
								</span>
								<span className="text-lg font-bold text-yellow-700 leading-tight">
									{pending}
								</span>
							</button>
						</>
					)}
				</section>
				{/* Transaction List */}
				{isLoading ? (
					<OrderListSkeleton />
				) : isError ? (
					<div className="text-red-500">Failed to load transactions.</div>
				) : data.orders && data.orders.length > 0 ? (
					<ul className="flex flex-col gap-4">
						{data.orders
							.filter((order: any) => {
								if (filter === "all") return true;
								if (filter === "paid") return order.orderStatus === "paid";
								if (filter === "pending")
									return order.orderStatus === "pending";
								return true;
							})
							.map((order: any) => (
								<OrderCard key={order.id} order={order} />
							))}
					</ul>
				) : (
					<div className="text-gray-500">No transactions found.</div>
				)}
			</main>
		</div>
	);
};

export default OrderListPage;
