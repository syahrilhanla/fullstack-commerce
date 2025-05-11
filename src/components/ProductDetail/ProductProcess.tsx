"use client";

import { useState } from "react";
import { Product } from "@/types/Product.type";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { PencilIcon } from "@heroicons/react/24/outline";

interface Props {
	product: Product;
}

const ProductProcess = ({ product }: Props) => {
	const { stock, minimumOrderQuantity } = product;

	const [quantity, setQuantity] = useState(minimumOrderQuantity);
	const [notes, setNotes] = useState<string | null>(null);
	const [error, setError] = useState("");

	const increase = () => {
		if (quantity < stock) {
			setQuantity((prev) => prev + 1);
		} else {
			setError("Maximum stock reached");
		}
	};

	const decrease = () => {
		if (quantity > minimumOrderQuantity) {
			setQuantity((prev) => prev - 1);
		} else {
			setError("Minimum order quantity reached");
		}
	};

	const handleDirectQuantity = (valueInput: string) => {
		const value = Number(valueInput);
		if (!isNaN(value) && value >= 1 && value <= stock) {
			setQuantity(value);
		}

		if (value < minimumOrderQuantity) {
			setError("Minimum order quantity reached");

			setTimeout(() => {
				setError("");
				setQuantity(minimumOrderQuantity);
			}, 2000);
		} else if (value > stock) {
			setError("Maximum stock reached");
		} else {
			setError("");
		}
	};

	return (
		<aside className="px-6">
			<div className="w-full px-6 py-4 rounded-lg border border-gray-800">
				<h5 className="text-gray-200 text-xl font-semibold">
					Set Quantity and Notes
				</h5>

				<div className="flex items-center gap-4 text-white mt-4">
					<div className="flex items-center border border-gray-600 rounded-xl px-3 py-1 bg-black">
						<button
							onClick={decrease}
							className="text-gray-400 hover:text-white transition"
						>
							<MinusIcon width={16} />
						</button>
						<input
							type="text"
							value={quantity}
							onChange={(e) => {
								handleDirectQuantity(e.target.value);
							}}
							style={{
								appearance: "none",
								MozAppearance: "none",
								WebkitAppearance: "none",
								border: "none",
							}}
							className="w-10 bg-transparent text-center outline-none text-white"
						/>
						<button
							onClick={increase}
							className="text-green-500 hover:text-green-400 transition"
						>
							<PlusIcon width={16} />
						</button>
					</div>
					<span className="text-lg">
						Stock: <strong>{stock}</strong>
					</span>
				</div>
				{error && <span className="text-red-500 text-sm ml-2">{error}</span>}

				<hr className="border-gray-800 border-t my-2" />

				<div className="flex flex-col gap-2">
					{notes === null && (
						<button
							className="text-sm w-fit text-gray-400 flex gap-2"
							onClick={() => setNotes("")}
						>
							<PencilIcon width={12} />
							Add notes
						</button>
					)}

					{notes !== null && (
						<>
							<label
								htmlFor="notes"
								className="text-gray-200 text-sm font-semibold"
							>
								Notes
							</label>
							<textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="w-full h-24 text-sm bg-transparent border border-gray-600 rounded-lg p-2 text-gray-200 focus:outline-none"
								placeholder="Add any special instructions or notes here..."
							/>
						</>
					)}
				</div>
			</div>
		</aside>
	);
};

export default ProductProcess;
