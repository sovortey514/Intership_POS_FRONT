const API_URL = "http://localhost:6060/admin";


export const createTable = async (values, token) => {
    try {
        const response = await fetch(`${API_URL}/createtable`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to create table");
        }

        return await response.json(); 

    } catch (error) {
        console.error("❌ Error creating table:", error.message);
        return { error: error.message || "An error occurred" };
    }
};

export const fetchTable = async (token) => {
    try {
        const response = await fetch(`${API_URL}/getalltables`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error("Error fetching Table:", errorMessage);
            throw new Error(errorMessage.message || "Failed to fetch Table.");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching Table:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};

export const deleteTablesById = async (id, token) => {
    if (!id) {
        console.error("❌ Error: Missing table ID.");
        return { error: "Table ID is missing. Cannot delete table." };
    }

    try {
        const response = await fetch(`${API_URL}/deletetable/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete table. Server response: ${response.statusText}`);
        }

        return { success: true, message: `Table with ID ${id} has been deleted.` };
    } catch (error) {
        console.error("❌ Error deleting table:", error);
        return { error: error.message || "An error occurred while deleting the table." };
    }
};


  export const updateTables = async (id, values, token) => {
    const response = await fetch(`${API_URL}/updateTable/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
    return response;
  };
  
  


