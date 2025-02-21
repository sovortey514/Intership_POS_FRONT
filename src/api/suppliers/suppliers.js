const API_URL = "http://localhost:6060/admin";

export const createSupplier = async (values, token) => {
    try {
        const response = await fetch(`${API_URL}/createSupplier`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

        // Log full response for debugging
        const responseText = await response.text();
        console.log("🔍 API Raw Response:", responseText);

        if (!response.ok) {
            throw new Error(responseText || "Failed to create Supplier");
        }

        return responseText ? JSON.parse(responseText) : {};

    } catch (error) {
        console.error("❌ Error creating Supplier:", error.message);
        return { error: error.message || "An error occurred" };
    }
};

export const fetchSuppliers = async (token) => {
    try {
        const response = await fetch(`${API_URL}/getallsuppliers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });


        if (!response.ok) {
            const errorMessage = await response.json();
            console.error("Error fetching suppliers:", errorMessage);
            throw new Error(errorMessage.message || "Failed to fetch suppliers.");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching materials:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};

export const updateSuppliers = async (id, values, token) => {
    try {
      const response = await fetch(`${API_URL}/Update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json(); 
      return data; 
    } catch (error) {
      console.error("Error updating supplier:", error);
      return null; 
    }
  };

export const deleteSuppliersById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/deleteSuppliers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response", response);

    if (!response.status === 200) {
      const errorMessage = await response.json();
      console.error("Error deleting Suppliers by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to delete Suppliers by ID.");
    }

    return response;
  } catch (error) {
    console.error("Error deleting Suppliers by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};
  