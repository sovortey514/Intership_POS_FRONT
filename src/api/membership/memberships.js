const API_URL = "http://localhost:6060/admin";

export const createmembership = async (values, token) => {
    try {
        const response = await fetch(`${API_URL}/createmembership`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

        const responseText = await response.text();


        if (!response.ok) {
            throw new Error(responseText || "Failed to create Memberships");
        }

        return responseText ? JSON.parse(responseText) : {};

    } catch (error) {
        console.error("❌ Error creating Memberships:", error.message);
        return { error: error.message || "An error occurred" };
    }
};

export const fetchMembership = async (token) => {
    try {
        const response = await fetch(`${API_URL}/getallmemberships`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });


        if (!response.ok) {
            const errorMessage = await response.json();
            console.error("Error fetching Membership:", errorMessage);
            throw new Error(errorMessage.message || "Failed to fetch Membership.");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching Membership:", error);
        throw new Error(error.message || "An unknown error occurred.");
    }
};

export const updateMembership = async (id, values, token) => {
    try {
      const response = await fetch(`${API_URL}/updatemembership/${id}`, {
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
      console.error("Error updating Membership:", error);
      return null; 
    }
  };

  
  export const deleteMembershipById = async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/deletemembership/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
  
      if (!response.status === 200) {
        const errorMessage = await response.json();
        console.error("Error deleting Membership by ID:", errorMessage);
        throw new Error(errorMessage.message || "Failed to delete Membership by ID.");
      }
  
      return response;
    } catch (error) {
      console.error("Error deleting Membership by ID:", error);
      throw new Error(error.message || "An unknown error occurred.");
    }
  };
    