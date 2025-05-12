"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";

const NavbarSearch = () => {
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
			onChange={(e) => console.log(e.currentTarget.value)}
		/>
	);
};

export default NavbarSearch;
