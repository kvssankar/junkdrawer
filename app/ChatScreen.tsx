// ChatScreen.tsx
import { Chat, MessageType } from "@flyerhq/react-native-chat-ui";
import { PreviewData } from "@flyerhq/react-native-link-preview";
import { Appbar, TextInput, Button, Chip } from "react-native-paper";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import LoaderKit from "react-native-loader-kit";
import { useRouter } from "expo-router";
import { chat } from "@/services/notes";

const getRandId = () => Math.floor(Math.random() * 1000);

const ChatScreen: React.FC = ({ navigation }) => {
  const router = useRouter();
  const assistant = { id: "assistant" };

  const [messages, setMessages] = useState<MessageType.Any[]>([
    {
      author: assistant,
      createdAt: Date.now(),
      id: getRandId(),
      text: "Need to find something or just reflect? Your notes are ready to chat",
      type: "text",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const user = { id: "user" };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <LoaderKit
          style={{ width: 50, height: 50 }}
          name={"BallPulse"} // Optional: see list of animations below
          color={"rgb(39, 111, 245)"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
        />
      </View>
    </View>
  );

  const handlePreviewDataFetched = ({
    message,
    previewData,
  }: {
    message: MessageType.Text;
    previewData: PreviewData;
  }) => {
    setMessages(
      messages.map<MessageType.Any>((m) =>
        m.id === message.id ? { ...m, previewData } : m
      )
    );
  };

  const handleSendPress = async (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: getRandId(),
      text: message.text,
      type: "text",
    };
    setMessages([textMessage, ...messages]);
    setIsLoading(true);

    const assMssg = await chat(messages);
    const assistantMessage: MessageType.Text = {
      author: assistant,
      createdAt: Date.now(),
      id: getRandId(),
      text: assMssg.answer,
      type: "text",
    };
    setMessages((prevMessages) => [assistantMessage, ...prevMessages]);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={"Echo"} />
      </Appbar.Header>
      <Chat
        messages={messages}
        onPreviewDataFetched={handlePreviewDataFetched}
        onSendPress={handleSendPress}
        user={user}
        customBottomComponent={isLoading ? TypingIndicator : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  typingContainer: {
    padding: 10,
    marginLeft: 10,
  },
  typingBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
    width: 70,
    alignItems: "center",
  },
  loader: {
    margin: 5,
  },
});

export default ChatScreen;
