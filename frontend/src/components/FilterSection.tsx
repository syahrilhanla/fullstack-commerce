"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
	AdjustmentsHorizontalIcon,
	TagIcon,
	XMarkIcon,
} from "@heroicons/react/16/solid";
import { Select, SelectItem } from "@heroui/react";

import pushQueryURL from "@/helpers/pushQueryURL";

import { Category } from "@/types/Category.type";
import { useCategoryStore } from "@/store/category.store";

const FilterSection = () => {
	const [selectedSort, setSelectedSort] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const [openCategory, setOpenCategory] = useState(false);
	const [openSort, setOpenSort] = useState(false);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { updateCategories } = useCategoryStore();

	const filters = [
		{ key: "price asc", label: "Low Price" },
		{ key: "price desc", label: "High Price" },
		{ key: "discountPercentage desc", label: "High Discount" },
		{ key: "discountPercentage asc", label: "Low Discount" },
		{ key: "rating desc", label: "High Rating" },
		{ key: "rating asc", label: "Low Rating" },
	];

	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const response = await fetch("https://dummyjson.com/products/categories");
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}

			const categories = (await response.json()) as Category[];
			updateCategories(categories);

			return categories;
		},
	});

	const categories = data as Category[];

	useEffect(() => {
		const newURL = pushQueryURL(
			{
				sortBy: selectedSort ? selectedSort.split(" ")[0] : undefined,
				order: selectedSort ? selectedSort.split(" ")[1] : undefined,
				category: selectedCategory ? selectedCategory : undefined,
			},
			pathname,
			searchParams.toString()
		);

		router.push(newURL);
	}, [selectedCategory, selectedSort, router]);

	return (
		<div className="w-full flex flex-wrap gap-3 items-center mb-4">
			<Select
				className="max-w-xs"
				label="Sort By"
				placeholder="Sort By"
				onSelectionChange={(sortBy) =>
					setSelectedSort(sortBy.currentKey || null)
				}
				isOpen={openSort}
				onOpenChange={(open) => {
					setOpenSort(open);
					if (open) {
						setOpenCategory(false);
					}
				}}
				radius="full"
				variant="bordered"
				value={selectedSort || ""}
				classNames={{
					trigger:
						"bg-white shadow-sm border focus:shadow-md focus:border-none focus:ring-0 focus:outline-none",
				}}
				startContent={<AdjustmentsHorizontalIcon width={20} color="gray" />}
				isDisabled={isLoading}
				renderValue={() => {
					return (
						<div
							className="flex items-center gap-2"
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<p className="text-gray-700">
								{filters.find((filter) => filter.key == selectedSort)?.label ||
									"Sort By"}
							</p>
							{selectedSort && (
								<button
									type="button"
									onClick={() => {
										setSelectedSort(null);
										setOpenSort(false);
									}}
									className="-mt-4 ml-3 absolute right-8 z-10 hover:bg-red-300 rounded-full p-0.5 duration-200"
								>
									<XMarkIcon width={16} color="red" />
								</button>
							)}
						</div>
					);
				}}
			>
				{filters.map((filter) => (
					<SelectItem
						key={filter.key}
						className="text-gray-700 hover:bg-transparent"
					>
						{filter.label}
					</SelectItem>
				))}
			</Select>

			<Select
				className="max-w-xs"
				label="Category"
				isDisabled={isLoading}
				placeholder="Category"
				isOpen={openCategory}
				onSelectionChange={(categoryUrl) =>
					setSelectedCategory(categoryUrl.currentKey || null)
				}
				onOpenChange={(open) => {
					setOpenCategory(open);
					if (open) {
						setOpenSort(false);
					}
				}}
				renderValue={() => {
					return (
						<div
							className="flex items-center gap-2"
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<p className="text-gray-700">
								{categories.find(
									(category) => category.slug == selectedCategory
								)?.name || "Category"}
							</p>
							{selectedCategory && (
								<button
									type="button"
									onClick={() => {
										setSelectedCategory(null);
										setOpenCategory(false);
									}}
									className="-mt-4 ml-3 absolute right-8 z-10 hover:bg-red-300 rounded-full p-0.5 duration-200"
								>
									<XMarkIcon width={16} color="red" />
								</button>
							)}
						</div>
					);
				}}
				items={categories}
				radius="full"
				variant="bordered"
				classNames={{
					trigger:
						"bg-white shadow-sm border focus:shadow-md focus:border-none focus:ring-0 focus:outline-none",
				}}
				startContent={<TagIcon width={20} color="gray" />}
				isLoading={isLoading}
			>
				{categories?.map((category) => (
					<SelectItem
						key={category.slug}
						className="text-gray-700 hover:bg-transparent"
					>
						{category.name}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export default FilterSection;
