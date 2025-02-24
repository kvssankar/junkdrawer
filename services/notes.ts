import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// API Gateway URL
const API_URL = "https://tptsuemqms.us-west-2.awsapprunner.com/notes";
const CHAT_URL = "https://tptsuemqms.us-west-2.awsapprunner.com/chat";

// Function to fetch notes from the API
export const fetchNotes = async () => {
  await AsyncStorage.setItem("userToken", "Bearer 123"); //TODO: FIX TOKEN
  const token = await AsyncStorage.getItem("userToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };
  const { data } = await axios.get(API_URL, { headers });
  return data;
};

// Function to create a new note
export const createNote = async (newNote) => {
  await AsyncStorage.setItem("userToken", "Bearer 123"); //TODO: FIX TOKEN
  const token = await AsyncStorage.getItem("userToken");
  const { data } = await axios.post(API_URL, newNote, {
    headers: { "Content-Type": "application/json", Authorization: token },
  });
  return data;
};

export const deleteNote = async (noteId) => {
  await AsyncStorage.setItem("userToken", "Bearer 123");
  const token = await AsyncStorage.getItem("userToken");
  try {
    await axios.delete(`${API_URL}/${noteId}`, {
      headers: { Authorization: token },
    });
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

export const updateNote = async (noteId, updatedNote) => {
  await AsyncStorage.setItem("userToken", "Bearer 123");
  const token = await AsyncStorage.getItem("userToken");
  try {
    await axios.put(`${API_URL}/${noteId}`, updatedNote, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

export const chat = async (messages) => {
  //get last five messages
  let formattedMessages = messages.slice(-5).map((message) => {
    if (message.author.id == "user") {
      return {
        role: "user",
        text: message.text,
      };
    } else {
      return {
        role: "assistant",
        text: message.text,
      };
    }
  });
  await AsyncStorage.setItem("userToken", "Bearer 123");
  const token = await AsyncStorage.getItem("userToken");
  try {
    const data = await axios.post(CHAT_URL, formattedMessages, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    return data;
  } catch (error) {
    console.error("Error chatting:", JSON.stringify(error, null, 2));
    const data = {
      answer: "something went wrong",
      relevantNotes: [],
    };
    return data;
  }
};
