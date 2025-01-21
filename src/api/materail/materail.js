const API_URL = "http://localhost:6060/admin";

export const updateCategory = async (id, values, token) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  return response;
};

export const createCategory = async (values, token) => {
  const response = await fetch(`${API_URL}/createCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  return response;
};

export const updateFixedAsset = async (id, values, token) => {
  const response = await fetch(`${API_URL}/updateFixedAsset/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  return response;
};

export const createMaterail = async (values, token) => {
  console.log("Creating material with values:", values);
  const response = await fetch(`${API_URL}/createMaterial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);
  console.log("Response object:", response);

  if (!response.ok) {
    const errorMessage = await response.json();
    console.error("Error creating material:", errorMessage);
    throw new Error(errorMessage.message || "Failed to create material.");
  }

  return response;  
};

export const uploadImage = async (file, fixedAssetId, token) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fixedAssetId", fixedAssetId);

  const response = await fetch(`${API_URL}/upload_image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response;
};

export const fetchMaterials = async (token) => {
  try {
    const response = await fetch(`${API_URL}/getAllFixedAssets`, {
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

export const fetchCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
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

export const fetchFixedAssetById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/getFixedAssetById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error fetching fixed asset by ID:", errorMessage);
      throw new Error(errorMessage.message || "Failed to fetch fixed asset by ID.");
    }

    const result = await response.json();
    return result.fixedAsset;
  } catch (error) {
    console.error("Error fetching fixed asset by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

// export const deleteFixedAssetById = async (id, token) => {
//   try {
//     const response = await fetch(`${API_URL}/deleteFixedAsset/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorMessage = await response.json();
//       console.error("Error deleting fixed asset by ID:", errorMessage);
//       throw new Error(errorMessage.message || "Failed to delete fixed asset by ID.");
//     }

//     return response;
//   } catch (error) {
//     console.error("Error deleting fixed asset by ID:", error);
//     throw new Error(error.message || "An unknown error occurred.");
//   }
// };

export const deleteFixedAssetById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/deleteFixedAsset/${id}`, {
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

    return response.json(); // Return response data if any (for success/failure message)
  } catch (error) {
    console.error("Error deleting fixed asset by ID:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};




