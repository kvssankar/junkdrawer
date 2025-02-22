import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, Chip, Menu, IconButton } from "react-native-paper";
import moment from "moment";
import { useRouter } from "expo-router";

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

  return (
    <Card style={styles.noteCard}>
      <Card.Title
        titleStyle={styles.cardDate}
        subtitleStyle={styles.cardTitle}
        title={moment(note.date).calendar()}
        subtitle={note.title}
        right={(props) => (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton {...props} icon="dots-vertical" onPress={openMenu} />
            }
          >
            <Menu.Item onPress={handleEdit} title="Edit" />
            <Menu.Item onPress={handleDelete} title="Delete" />
          </Menu>
        )}
      />
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
    backgroundColor: "#f9f9f9", // Light gray background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android shadow
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12, // Nicer border radius
    borderColor: "#eaeaea",
    borderWidth: 1,
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
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
    marginBottom: 10,
  },
  noteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  noteTag: {
    marginRight: 8,
    marginBottom: 5,
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
