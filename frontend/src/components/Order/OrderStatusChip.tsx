import { Chip } from "@heroui/react";

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

export default StatusChip;
