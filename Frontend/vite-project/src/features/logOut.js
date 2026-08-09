import api from "../../utils/axios.js";

async function logOut() {
  try {
    const { data } = await api.get("/api/auth/logout");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    return null;
  }
}

export default logOut;