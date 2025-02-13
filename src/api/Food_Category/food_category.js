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
    console.log("Response", response);

    if(!response.status===200){  
      const errorMessage = await response.json();
      console.error("Error deleting Cagory by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to delete fixed asset by ID.");
    }

    return response;
  } catch (error) {
    console.error("Error deleting Cagory by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};


export const updateCategory = async (id, values, token) => {
  const response = await fetch(`${API_URL}/UpdateCategoryFoodDrink/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  return response;
};


export const createSubCategory = async (categoryId, subCategories, token) => {
  try {
    if (!categoryId || !subCategories || !Array.isArray(subCategories) || subCategories.length === 0) {
      throw new Error("Invalid input: categoryId must be a number, and subCategories must be provided.");
    }

    const response = await fetch(`${API_URL}/subcategory/${categoryId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subCategories), 
    });

    const responseText = await response.text(); 
    if (!response.ok) {
      throw new Error(responseText || "Failed to create subcategory.");
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText); // Parse only if there's a valid JSON response
    } catch (err) {
      console.warn("Response is not valid JSON:", responseText);
      responseData = [];
    }

    return responseData;
  } catch (error) {
    console.error("Error creating subcategory:", error.message);
    return { error: error.message || "An error occurred" };
  }
};

export const fetchSubcategory = async (token) => {
  try {
    const response = await fetch(`${API_URL}/getAllSubCategoryFoodDrinks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    
    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching subcategory:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch subcategory.");
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const deleteSubCagoryFoodDrinkById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/deleteSubcategoryFoodDrink/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response", response);

    if(!response.status===200){  
      const errorMessage = await response.json();
      console.error("Error deleting Cagory by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to delete fixed asset by ID.");
    }

    return response;
  } catch (error) {
    console.error("Error deleting Cagory by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const updateSubCategory = async (id, values, token) => {
  try {
      const response = await fetch(`${API_URL}/updateSubcategoryFoodDrink/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Update Subcategory Response:", data);

      return response;
  } catch (error) {
      console.error("Error updating subcategory:", error);
      throw new Error("Failed to update subcategory.");
  }
};

export const createSize= async (values, token) => {
  try {
    const response = await fetch(`${API_URL}/createSize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create Size");
    }

    const data = await response.text();
    return data ? JSON.parse(data) : {}; 

  } catch (error) {
    console.error("Error creating Size:", error.message);
    return { error: error.message || "An error occurred" };
  }
};

export const fetchSize = async (token) => {
  try {
    const response = await fetch(`${API_URL}/getAllSize`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    
    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching size:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch size.");
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching size:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};





