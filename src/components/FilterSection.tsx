"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AdjustmentsHorizontalIcon, TagIcon } from "@heroicons/react/16/solid";
import { Select, SelectItem } from "@heroui/react";

import usePushQuery from "@/helpers/usePushQuery";

import { Category } from "@/types/Category.type";
import { useCategoryStore } from "@/store/category.store";

const FilterSection = () => {
	const [selectedSort, setSelectedSort] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const router = useRouter();

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

	const newURL = usePushQuery({
		sort: selectedSort ? selectedSort : undefined,
		category: selectedCategory ? selectedCategory : undefined,
	});

	useEffect(() => {
		if (newURL) {
			router.push(newURL);
		}
	}, [newURL, router]);

	return (
		<div className="w-full flex flex-wrap gap-3 items-center mb-4">
			<Select
				className="max-w-xs"
				label="Sort By"
				placeholder="Sort By"
				onSelectionChange={(sortBy) =>
					setSelectedSort(sortBy.currentKey || null)
				}
				radius="full"
				variant="bordered"
				classNames={{
					trigger:
						"bg-white shadow-sm border focus:shadow-md focus:border-none focus:ring-0 focus:outline-none",
				}}
				startContent={<AdjustmentsHorizontalIcon width={20} color="gray" />}
				isDisabled={isLoading}
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
				onSelectionChange={(categoryUrl) =>
					setSelectedCategory(categoryUrl.currentKey || null)
				}
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
