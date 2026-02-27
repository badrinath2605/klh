import { useAuth } from "@clerk/clerk-expo";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useApi() {
  const { getToken } = useAuth();

  const apiGet = async (endpoint: string) => {
    const token = await getToken();

    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    return res.json();
  };

  return { apiGet };
}
