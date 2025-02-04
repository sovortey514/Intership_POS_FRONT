const API_URL = "http://localhost:6060/admin";


export const createFood_Category = async (values, token) => {
    try {
      const response = await fetch(`${API_URL}/CreateCategoryFoodDrink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create category");
      }

      const data = await response.text();
      return data ? JSON.parse(data) : {}; 
  
    } catch (error) {
      console.error("Error creating category:", error.message);
      return { error: error.message || "An error occurred" };
    }
  };

export const fetchcreateFood_Category = async (token) => {
  try {
    const response = await fetch(`${API_URL}/getAllCategoryFood_Drink`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    
    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching materials:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch materials.");
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const deleteCagoryFoodDrinkById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/deleteCagoryFoodDrink/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error deleting fixed asset by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to delete fixed asset by ID.");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting fixed asset by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};
