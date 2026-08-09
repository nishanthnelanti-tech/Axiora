import api from "../../utils/axios.js";

export const getConversations = async () => {
  try {
    const response = await api.get("/api/chat/get-conversations");
    const data = response?.data ?? [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return [];
    }
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default getConversations;
