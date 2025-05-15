import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

interface Props {
	decrease: () => void;
	increase: () => void;
	quantity: number;
	handleDirectQuantity: (valueInput: string) => void;
}

const QuantityModifier = ({
	decrease,
	increase,
	quantity,
	handleDirectQuantity,
}: Props) => {
	return (
		<div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50">
			<button
				onClick={decrease}
				className="text-gray-500 hover:text-gray-700 transition"
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
				className="w-10 bg-transparent text-center outline-none text-gray-600"
			/>
			<button
				onClick={increase}
				className="text-green-600 hover:text-green-500 transition"
			>
				<PlusIcon width={16} />
			</button>
		</div>
	);
};

export default QuantityModifier;
