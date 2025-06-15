const FilterButtonSkeleton = () => (
	<div className="flex gap-2 w-full justify-center md:justify-start">
		{[1, 2, 3].map((i) => (
			<div
				key={i}
				className="flex flex-col items-center rounded-lg px-4 py-2 min-w-[90px] border bg-gray-100 animate-pulse shadow-sm"
			>
				<div className="h-3 w-10 bg-gray-300 rounded mb-2" />
				<div className="h-5 w-6 bg-gray-300 rounded" />
			</div>
		))}
	</div>
);

export default FilterButtonSkeleton;
