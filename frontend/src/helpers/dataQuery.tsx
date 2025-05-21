import { useUserInfoStore } from "@/store/userInfo.store";
import { useQuery } from "@tanstack/react-query";

export const apiFetch = async (
	url: string,
	token: string | null
): Promise<any> => {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	// if Unauthorized, try to refresh the token
	// and retry the request
	if (response.status === 401) {
		console.error("Unauthorized access - token may be invalid or expired");

		const response = await fetch("http://localhost:8000/api/auth/refresh/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (response.status !== 200) {
			console.error("Failed to refresh token");
			// need to return to login page
			return null;
		}

		const newAccessToken = await response.json();
		const newResponse: any = await apiFetch(url, newAccessToken.access);

		return newResponse;
	}

	return response.json();
};

export const useFetchQuery = (
	url: string,
	queries: string[],
	isEnabled?: boolean
) => {
	const { accessToken } = useUserInfoStore();

	const { data, isError, isLoading } = useQuery({
		queryKey: queries,
		queryFn: async () => await apiFetch(url, accessToken),
		enabled: isEnabled || undefined,
	});

	if (isError) {
		console.error("Error fetching data:", isError);
	}

	return {
		data,
		isLoading,
		isError,
	};
};

export const apiPost = async (
	url: string,
	body: object,
	token: string | null
) => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		method: "POST",
		headers,
		credentials: "include",
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return {
		data: await response.json(),
		status: response.status,
	};
};
