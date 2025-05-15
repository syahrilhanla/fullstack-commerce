"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const NavbarSearch = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	const [search, setSearch] = useState(searchQuery);
	const debouncedSearch = useDebounce(search, 500);
	const router = useRouter();

	// Update the query parameter when the debounced search value changes
	useEffect(() => {
		if (debouncedSearch.length > 3) {
			if (pathname !== "/") {
				router.push("/?search=" + debouncedSearch); // Redirect to the homepage with the search query
			} else router.push(`?search=${debouncedSearch}`); // Update the URL with the search query
		} else {
			router.push("?"); // Clear the search query if the input is empty
		}
	}, [debouncedSearch, router, pathname]);

	return (
		<Input
			classNames={{
				base: "w-[24rem] h-10",
				mainWrapper: "h-full",
				input: "text-small text-gray-900 placeholder-gray-500",
				inputWrapper:
					"h-full font-normal text-gray-700 bg-gray-100 text-gray-900 border border-gray-300",
			}}
			placeholder="Search product"
			size="sm"
			color="default"
			variant="flat"
			startContent={<MagnifyingGlassIcon height={24} color="gray" />}
			type="search"
			radius="full"
			isClearable
			onChange={(e) => setSearch(e.currentTarget.value)}
			onClear={() => setSearch("")}
			value={search}
		/>
	);
};

export default NavbarSearch;
