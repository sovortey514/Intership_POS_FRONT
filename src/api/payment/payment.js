const API_URL = "http://localhost:6060/auth";

export const fetchPayment = async (token) => {
  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching Payment:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch Payment.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Payment:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const fetchPaymentById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/payment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching Payment by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch Payment by ID.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Payment by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};