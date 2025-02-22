import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// API Gateway URL
const API_URL = "https://tptsuemqms.us-west-2.awsapprunner.com/notes";

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
