import { usePathname, useSearchParams } from "next/navigation";

type Queries = {
	[key: string]: string | string[] | undefined;
};

const usePushQuery = (queriesToPush: Queries) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const constructedURL = new URLSearchParams(searchParams.toString());
	Object.entries(queriesToPush).forEach(([key, value]) => {
		if (value) {
			if (Array.isArray(value)) {
				constructedURL.delete(key);
				value.forEach((val) => constructedURL.append(key, val));
			} else {
				constructedURL.set(key, value);
			}
		} else {
			constructedURL.delete(key);
		}
	});

	const newURL = constructedURL.toString()
		? `${pathname}?${constructedURL.toString()}`
		: "";

	return newURL;
};

export default usePushQuery;
