const API_URL = "http://localhost:6060/auth";

export const placetoOrder = async (values, token) => {
  try {
    const response = await fetch(`${API_URL}/placeordercontroller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Failed to placeorder");
    }

    return responseText ? JSON.parse(responseText) : {};

  } catch (error) {
    console.error("❌ Error placeorder:", error.message);
    return { error: error.message || "An error occurred" };
  }
};

export const fetchOrder = async (token) => {
  try {
    const response = await fetch(`${API_URL}/getallorders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching Order:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch Order.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const FetchOrderById = async (id, token) => {
  try {
    if (!id) {
      throw new Error("Invalid order ID");
    }

    const response = await fetch(`${API_URL}/getordersummary/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching Order by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch Order by ID.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Order by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const CancelOrder = async (id, token) => {
  try {
    if (!id) {
      throw new Error("Invalid order ID");
    }

    const response = await fetch(`${API_URL}/cancel/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error cancel Order by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to cancel Order by ID.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancel Order by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const processPaymentcash = async (values, token) => {
  try {
    const response = await fetch(`${API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error response text:", responseText);
      throw new Error(responseText || "Failed to process payment");
    }

    // If response is ok, parse and return it
    const responseText = await response.text();
    return JSON.parse(responseText);

  } catch (error) {
    console.error("❌ Error Payment:", error.message);
    return { error: error.message || "An error occurred" };
  }
};

export const PaymentcashByMembershipCard = async (values, token) => {
  try {
    const response = await fetch(`${API_URL}/processWithMembership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Failed to Payment");
    }

    return responseText ? JSON.parse(responseText) : {};

  } catch (error) {
    console.error("❌ Error Payment:", error.message);
    return { error: error.message || "An error occurred" };
  }
};

export const completeOrder = async (id, token) => {
  try {
    if (!id) {
      throw new Error("Invalid order ID");
    }

    const response = await fetch(`${API_URL}/complete/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error complete Order by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to complete Order by ID.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error complete Order by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const editOrder = async (orderId, values, token) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableId: values.tableId,
        items: values.items
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Failed to update order");
    }

    return responseText ? JSON.parse(responseText) : {};

  } catch (error) {
    console.error("❌ Error editing order:", error.message);
    return { error: error.message || "An error occurred" };
  }
};














