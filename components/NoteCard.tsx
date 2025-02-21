import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, Chip, Menu, IconButton } from "react-native-paper";
import moment from "moment";
import { useRouter } from "expo-router";

// A component for an individual note card.
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
        titleStyle={{ fontSize: 14 }}
        subtitleStyle={{ fontSize: 18, fontWeight: "700" }}
        title={moment(note.date).calendar()}
        subtitle={note.title}
        // The "right" prop lets you render a component at the top right.
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
        <Text style={{ fontSize: 15 }}>{note.content}</Text>
        <View style={styles.noteTags}>
          {note.tags.map((tag, idx) => (
            <Chip key={idx} style={styles.noteTag}>
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
    backgroundColor: "white",
    shadowColor: "transparent", // Removes iOS shadow
    // Optionally, you can also reset other iOS shadow properties:
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 16,
    borderRadius: 0,
  },
  noteTags: {
    flexDirection: "row",
    marginTop: 8,
  },
  noteTag: {
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
};

export default NoteCard;
