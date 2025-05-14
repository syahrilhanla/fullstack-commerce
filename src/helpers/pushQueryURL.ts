type Queries = {
	[key: string]: string | string[] | undefined;
};

const pushQueryURL = (
	queriesToPush: Queries,
	pathname: string,
	searchParams: string
) => {
	const constructedURL = new URLSearchParams(searchParams);
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
		: "/";

	return newURL;
};

export default pushQueryURL;
