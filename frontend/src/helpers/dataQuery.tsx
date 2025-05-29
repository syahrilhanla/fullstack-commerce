import { DataQueryEnum } from "@/enums/dataQuery.enum";
import { useCartStore } from "@/store/cart.store";
import { useUserInfoStore } from "@/store/userInfo.store";
import { CartProduct } from "@/types/Cart.type";
import { UserInfo } from "@/types/UserInfo.type";
import { useQuery } from "@tanstack/react-query";

export const refreshAuthToken = async (): Promise<string | null> => {
	const { setAccessToken, setUserInfo } = useUserInfoStore.getState();

	const response = await fetch("http://localhost:8000/api/auth/refresh/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (response.status !== 200) {
		console.error("Failed to refresh token");
		return DataQueryEnum.INVALID_REFRESH_TOKEN;
	}

	const newAccessToken = await response.json();
	setAccessToken(newAccessToken.access);

	const userInfo: UserInfo = await apiFetch(
		"http://localhost:8000/api/me/",
		newAccessToken.access
	);
	setUserInfo({
		id: userInfo.id,
		email: userInfo.email,
		name: `${userInfo.first_name} ${userInfo.last_name}`,
		userName: userInfo.username,
	});

	return newAccessToken.access;
};

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

		const newAccessToken = await refreshAuthToken();

		if (newAccessToken === DataQueryEnum.INVALID_REFRESH_TOKEN) {
			return DataQueryEnum.INVALID_REFRESH_TOKEN;
		}

		return await apiFetch(url, newAccessToken);
	}

	if (!response.ok) {
		return null;
	}

	return response.json();
};

export const useFetchQuery = (
	url: string,
	queries: string[],
	isEnabled?: boolean,
	customQueryFn?: () => Promise<any>
) => {
	const { accessToken } = useUserInfoStore();

	const { data, isError, isLoading } = useQuery({
		queryKey: queries,
		queryFn: async () =>
			customQueryFn ? await customQueryFn() : await apiFetch(url, accessToken),
		enabled: isEnabled || undefined,
		refetchOnReconnect: true,
		refetchInterval: 10000,
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
	token: string | null,
	method: "POST" | "PUT" = "POST"
): Promise<any> => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		method: method,
		headers,
		credentials: "include",
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		console.error("Network response was not ok");
	}

	if (response.status === 401) {
		console.error("Unauthorized access - token may be invalid or expired");
		const newAccessToken = await refreshAuthToken();

		if (newAccessToken === DataQueryEnum.INVALID_REFRESH_TOKEN) {
			return DataQueryEnum.INVALID_REFRESH_TOKEN;
		}

		if (newAccessToken) {
			return await apiPost(url, body, newAccessToken);
		}
	}

	return {
		data: await response.json(),
		status: response.status,
	};
};

export const getInitialCartItems = async () => {
	const { userInfo, accessToken } = useUserInfoStore.getState();
	const { addProduct, products } = useCartStore.getState();
	const guestCart = localStorage.getItem("cart-storage");

	const data = await apiFetch(
		`http://localhost:8000/api/cart/cart_items/?user=${userInfo?.id}`,
		accessToken
	);

	const mergedCartItems = new Map<number, CartProduct>();

	if (userInfo && data) {
		data?.length &&
			data.forEach((item: CartProduct) => {
				const existingItem = mergedCartItems.get(item.productId);

				if (!existingItem) {
					mergedCartItems.set(item.productId, item);
				}
			});
	}

	if (guestCart) {
		const guestCartItems = JSON.parse(guestCart).state.products;

		// Merge guest cart items with user cart items
		guestCartItems.forEach((item: CartProduct) => {
			if (!mergedCartItems.has(item.productId)) {
				mergedCartItems.set(item.productId, item);
			} else {
				const existingItem = mergedCartItems.get(item.productId);
				if (existingItem) {
					existingItem.quantity += item.quantity;
					existingItem.total += item.total;
					existingItem.discountedTotal += item.discountedTotal;
				}
			}
		});
	}

	if (data) {
		data?.length &&
			data.forEach((item: CartProduct) => {
				const existingProduct = products.find(
					(product) => product.id === item.id
				);

				if (!existingProduct) {
					addProduct({
						...item,
					});
				}
			});
	}
};

export const createInvoice = async (
	selectedProductIds: number[],
	totalAmount: number
) => {
	const { userInfo, accessToken } = useUserInfoStore.getState();
	const { products } = useCartStore.getState();

	const selectedProducts = products.filter((product) =>
		selectedProductIds.includes(product.productId)
	);

	const items = selectedProducts.map((product) => ({
		name: product.title,
		quantity: product.quantity,
		price: product.price * 1000 * (1 - product.discountPercentage / 100),
	}));

	if (!userInfo) {
		console.error("User is not logged in");
		return null;
	}

	const { data } = await apiPost(
		`http://localhost:8000/api/checkout/`,
		{
			external_id: `invoice-${Date.now()}-${userInfo.id}`,
			amount: totalAmount,
			currency: "IDR",
			customer: {
				given_names: userInfo.name.split(" ")[0],
				surname: userInfo.name.split(" ")[1] || "",
				email: userInfo.email,
			},
			customer_notification_preference: {
				invoice_paid: ["email"],
			},
			// success_redirect_url: "example.com/success",
			// failure_redirect_url: "example.com/failure",
			items,
			fees: [
				{
					type: "Free Shipping",
					value: 0,
				},
			],
		},
		accessToken,
		"POST"
	);

	console.log("Invoice created successfully:", data);
};
