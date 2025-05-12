"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavbarSearch = () => {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);
	const router = useRouter();

	// Update the query parameter when the debounced search value changes
	useEffect(() => {
		if (debouncedSearch) {
			router.push(`?search=${debouncedSearch}`); // Update the URL with the search query
		} else {
			router.push("?"); // Clear the search query if the input is empty
		}
	}, [debouncedSearch, router]);

	return (
		<Input
			classNames={{
				base: "w-[24rem] h-10",
				mainWrapper: "h-full",
				input: "text-small",
				inputWrapper:
					"h-full font-normal text-default-500 bg-default-400/20 text-white",
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
		/>
	);
};

export default NavbarSearch;
