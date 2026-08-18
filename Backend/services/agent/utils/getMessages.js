import axios from "axios";

export const getMessages = async (conversationID) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE}/get-messages/${conversationID}`);
      return data
  } catch (error) {
    console.log(error);
    return null;
  }
};
