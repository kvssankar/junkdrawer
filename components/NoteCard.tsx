import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { Card, Text, Chip, Menu, IconButton } from "react-native-paper";
import moment from "moment";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoteCard = ({ note }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useRouter();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    closeMenu();
    // Navigate to the appropriate edit screen based on note type
    if (note.type === "voice") {
      navigation.push({
        pathname: "/EditVoiceNote",
        params: { note: JSON.stringify(note) },
      });
    } else if (note.type === "image") {
      navigation.push({
        pathname: "/EditImageNote",
        params: { note: JSON.stringify(note) },
      });
    } else {
      navigation.push({
        pathname: "/EditNote",
        params: { note: JSON.stringify(note) },
      });
    }
  };

  const handleDelete = () => {
    closeMenu();
    // Implement your delete logic here (e.g., call an API or update state).
    console.log("Delete note with id:", note.id);
  };

  const renderNoteIcon = () => {
    switch (note.type) {
      case "voice":
        return (
          <MaterialCommunityIcons name="microphone" size={40} color="#555" />
        );
      case "text":
        return (
          <Image
            source={require("../assets/images/pencil.png")}
            style={{ width: 40, height: 40 }}
          />
        );
      default:
        return (
          <MaterialCommunityIcons name="note-text" size={40} color="#555" />
        );
    }
  };

  return (
    <Card style={styles.noteCard}>
      <View style={styles.titleContainer}>
        {renderNoteIcon()}
        <View style={styles.titleTextContainer}>
          <Text style={styles.cardTitle}>{note.title}</Text>
          <Text style={styles.cardDate}>{moment(note.date).calendar()}</Text>
        </View>
      </View>
      <Card.Content>
        <Text style={styles.noteContent}>{note.content}</Text>
        <View style={styles.noteTags}>
          {note.tags.map((tag, idx) => (
            <Chip
              key={idx}
              style={styles.noteTag}
              textStyle={styles.noteTagText}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = {
  noteCard: {
    backgroundColor: "rgba(241, 245, 245, 0.77)", // Light gray background
    shadowColor: "transparent",
    marginBottom: 16,
    borderRadius: 12, // Nicer border radius
    borderColor: "transparent",
    borderWidth: 1,
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  titleTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "Poppins_700Bold",
    marginTop: 2,
    color: "#333",
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 15,
  },
  noteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    // marginTop: 10,
  },
  noteTag: {
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
    borderWidth: 0.5,
  },
  noteTagText: {
    fontSize: 12,
    color: "#666",
  },
};

export default NoteCard;
