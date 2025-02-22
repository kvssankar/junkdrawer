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
    },
  ];
  const [notes, setNotes] = useState(n);

  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  const handleTagPress = (tag) => {
    setSelectedTag(tag);
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
          icon="text"
          style={styles.fab}
          small
          onPress={() => setIsTextModalVisible(true)}
        />
        <FAB
          icon="microphone"
          style={styles.fab}
          small
          onPress={() => setIsVoiceModalVisible(true)}
        />
        <FAB
          icon="image"
          style={styles.fab}
          small
          onPress={() => setIsCameraModalVisible(true)}
        />
      </View>

      <AddNoteModal
        isVisible={isTextModalVisible}
        onClose={() => setIsTextModalVisible(false)}
        onAdd={(noteText) => {
          setNotes([
            {
              title: "New Note",
              content: noteText,
              tags: ["New"],
              date: new Date(),
            },
            ...notes,
          ]);
          setIsTextModalVisible(false);
        }}
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
  },
  fab: {
    margin: 8,
    shadowColor: "transparent",
  },
});

export default HomeScreen;
