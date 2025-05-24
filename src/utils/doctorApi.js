import api from "./api";

/**
 * Get a list of online doctors
 * @param {Object} filters - Optional filters for the search
 * @param {string} filters.specialization - Filter by doctor's specialization
 * @param {string} filters.search - Search term for doctor's name
 * @returns {Promise<Array>} List of online doctors
 */
export const getOnlineDoctors = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    // Add filters to query parameters if they exist
    if (filters.specialization) {
      params.append("specialization", filters.specialization);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await api.get(`/doctors/online?${params.toString()}`);

    // Check if response has the expected structure
    if (!response.data) {
      throw new Error("Invalid response format from server");
    }

    // If response.data is an object with a data property (common API pattern)
    if (response.data.data) {
      return response.data.data;
    }

    // If response.data is directly the array of doctors
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data is an object with doctors array
    if (response.data.doctors && Array.isArray(response.data.doctors)) {
      return response.data.doctors;
    }

    throw new Error("Unexpected response format from server");
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error("Please login to view doctors");
        case 404:
          throw new Error("No online doctors found");
        case 500:
          throw new Error("Server error. Please try again later");
        default:
          throw new Error(
            error.response.data?.message || "Failed to fetch online doctors"
          );
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Get a single doctor's details
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} Doctor's details
 */
export const getDoctorDetails = async (doctorId) => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error("Please login to view doctor details");
        case 404:
          throw new Error("Doctor not found");
        case 500:
          throw new Error("Server error. Please try again later");
        default:
          throw new Error(
            error.response.data?.message || "Failed to fetch doctor details"
          );
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * Update doctor's online status
 * @param {boolean} isOnline - The new online status
 * @returns {Promise<Object>} Updated doctor status
 */
export const updateDoctorStatus = async (isOnline) => {
  try {
    const response = await api.patch("/doctors/status", { isOnline });
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error("Please login to update status");
        case 403:
          throw new Error("Only doctors can update their status");
        case 500:
          throw new Error("Server error. Please try again later");
        default:
          throw new Error(
            error.response.data?.message || "Failed to update status"
          );
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
