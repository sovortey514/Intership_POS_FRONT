const API_URL = "http://localhost:6060/auth";

export const fetchuser = async (token) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error("Error fetching users:", errorMessage);
            throw new Error(errorMessage.message || "Failed to fetch users.");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};