import AddNoteModal from "@/components/AddNoteModal";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Searchbar, Chip, FAB } from "react-native-paper";
import NoteCard from "@/components/NoteCard";
import VoiceNoteModal from "@/components/VoiceNoteModal";
import CameraModal from "@/components/CameraModal";

const HomeScreen = () => {
  const tags = ["All Tags", "Finance", "Health", "Learning", "Sankar"];
  const [selectedTag, setSelectedTag] = useState("All Tags");

  const n = [
    {
      title: "Honey-Do List",
      content: "Shopping list and tasks...",
      tags: ["Family", "To do List"],
      date: new Date(),
      type: "text",
    },
  ];
  const [notes, setNotes] = useState(n);

  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  const handleTagPress = (tag) => {
    setSelectedTag(tag);
  };

  const getRandId = () => Math.floor(Math.random() * 1000);

  const handleAddTextNote = (noteText) => {
    const id = getRandId();
    setNotes([
      {
        id: id,
        title: "Processing...",
        content: noteText,
        tags: [],
        date: new Date(),
        type: "text",
      },
      ...notes,
    ]);
    setTimeout(() => {
      setNotes((prevState) => {
        //if prev state has same id then update the title or else create a new note
        const noteWithId = prevState.find((note) => note.id === id);
        if (noteWithId) {
          noteWithId.title = "New Text Note " + noteText;
          return [...prevState];
        } else {
          return [
            ...prevState,
            {
              id: id,
              title: "New Text Note " + noteText,
              content: noteText,
              tags: [],
              date: new Date(),
              type: "text",
            },
          ];
        }
      });
    }, 3000);
    setIsTextModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar placeholder="Search anything" style={styles.searchBar} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagContainer}
      >
        {tags.map((tag, index) => (
          <Chip
            key={index}
            style={[styles.tag, selectedTag === tag && styles.selectedTag]}
            mode="outlined"
            textStyle={{ color: selectedTag === tag ? "white" : "black" }}
            onPress={() => handleTagPress(tag)}
          >
            {tag}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.notesList}>
        {notes.map((note, index) => (
          <NoteCard key={index} note={note} />
        ))}
      </ScrollView>

      <View style={styles.bottomActions}>
        <FAB
          icon="microphone"
          style={[
            styles.fab,
            { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
          ]}
          color="white"
          small
          onPress={() => setIsVoiceModalVisible(true)}
        />
        <FAB
          icon="text"
          style={styles.fab}
          color="white"
          small
          onPress={() => setIsTextModalVisible(true)}
        />
        <FAB
          icon="camera"
          style={[
            styles.fab,
            { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
          ]}
          color="white"
          small
          onPress={() => setIsCameraModalVisible(true)}
        />
      </View>

      <AddNoteModal
        isVisible={isTextModalVisible}
        onClose={() => setIsTextModalVisible(false)}
        onAdd={handleAddTextNote}
      />
      <VoiceNoteModal
        isVisible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onSave={(voiceNote) => setNotes([voiceNote, ...notes])}
      />
      <CameraModal
        isVisible={isCameraModalVisible}
        onClose={() => setIsCameraModalVisible(false)}
        onCapture={(imageUri) =>
          setNotes([
            {
              title: "New Image Note",
              content: "",
              imageUri,
              tags: ["Image"],
              date: new Date(),
              type: "image",
            },
            ...notes,
          ])
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: "rgb(241, 245, 245)",
  },
  tagContainer: {
    maxHeight: 35,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tag: {
    marginRight: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderColor: "transparent",
  },
  selectedTag: {
    backgroundColor: "rgb(69, 129, 240)",
    color: "white",
  },
  notesList: {
    flex: 1,
    padding: 16,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 20,
  },
  fab: {
    // margin: 8,
    borderRadius: 0,
    backgroundColor: "rgb(69, 129, 240)",
    color: "white",
    shadowColor: "transparent",
  },
});

export default HomeScreen;
