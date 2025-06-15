"use client";

import { formatDate, formatPriceIDR } from "@/helpers/helpers";
import { Order } from "@/types/Order.type";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Divider,
	Image,
} from "@heroui/react";
const OrderDetailModal = ({
	order,
	onClose,
}: {
	order: Order;
	onClose: () => void;
}) => (
	<Modal
		isOpen={true}
		onClose={onClose}
		size="md"
		className="max-w-lg mx-auto"
		aria-label="Order Details"
		shadow="lg"
		scrollBehavior="inside"
	>
		<ModalContent>
			{() => (
				<>
					<ModalHeader className="my-0 h-14">
						<h2 className="text-lg font-semibold">Transaction Details</h2>
					</ModalHeader>
					<ModalBody>
						<div className="grid gap-2">
							<h2 className="text-base font-semibold text-gray-800">
								{order.orderStatus === "paid"
									? "Transaction Successful"
									: "Transaction Pending"}
							</h2>

							<div className="flex flex-col gap-1">
								<span className="flex justify-between text-sm text-gray-500/90">
									<span className="font-medium">Invoice Number:</span>{" "}
									<span className="text-success-500 font-semibold">
										{order.externalId}
									</span>
								</span>
								<span className="flex justify-between text-sm text-gray-500/90">
									<span className="font-medium">Order Time:</span>{" "}
									<span className="text-gray-900">
										{formatDate(order.createdAt)}
									</span>
								</span>
							</div>

							<Divider className="my-2" orientation="horizontal" />

							<div className="grid gap-2">
								<h3 className="text-base font-semibold text-gray-800">
									Items Ordered
								</h3>

								{order.orderItems.map((item) => (
									<div
										key={item.id}
										className="flex justify-between items-center py-2 border-b border-gray-200"
									>
										<div className="flex items-center gap-3">
											<Image
												src={item.product.thumbnail}
												height={50}
												width={50}
												alt={item.product.title}
												className="object-cover rounded-lg w-16 h-16"
											/>
											<div className="flex flex-col">
												<p className="text-sm font-medium text-gray-800">
													{item.product.title}
												</p>
												<p className="text-xs text-gray-500/90">
													{item.quantity} x {formatPriceIDR(item.price)}
												</p>
											</div>
										</div>
										<p className="text-sm font-semibold text-gray-800">
											{formatPriceIDR(item.price * item.quantity)}
										</p>
									</div>
								))}
							</div>
						</div>
					</ModalBody>
				</>
			)}
		</ModalContent>
	</Modal>
);

export default OrderDetailModal;
