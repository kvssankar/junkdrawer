import AddNoteModal from "@/components/AddNoteModal";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { Searchbar, Chip, Card, FAB } from "react-native-paper";
import moment from "moment";
import NoteCard from "@/components/NoteCard";
import VoiceNoteModal from "@/components/VoiceNoteModal";
import CameraModal from "@/components/CameraModal";

const HomeScreen = () => {
  const tags = ["All Tags", "Finance", "Health", "Learning", "sankar"];
  const n = [
    {
      title: "Honey-Do List",
      content: "Shopping list and tasks...",
      tags: ["Family", "To do List"],
      date: new Date(),
    },
    // Add more notes as needed
  ];
  const [notes, setNotes] = useState(n);

  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  const handleAddNote = (noteText) => {
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
  };

  const handleAddVoiceNote = (voiceNote) => {
    setNotes([voiceNote, ...notes]);
    setIsVoiceModalVisible(false);
  };

  const handleCaptureImage = (imageUri: string) => {
    const newImageNote = {
      title: "New Image Note",
      content: "", // You may add description later
      imageUri, // Save the image URI
      tags: ["Image"],
      date: new Date(),
      type: "image", // Mark the note as an image note
    };
    setNotes([newImageNote, ...notes]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Searchbar placeholder="Search" style={styles.searchBar} />
      </View>

      {/* Tags */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagContainer}
      >
        {tags.map((tag, index) => (
          <Chip key={index} style={styles.tag} mode="outlined">
            {tag}
          </Chip>
        ))}
      </ScrollView>

      {/* Notes List */}
      <ScrollView style={styles.notesList}>
        {notes.map((note, index) => (
          <NoteCard key={index} note={note} />
        ))}
      </ScrollView>

      {/* Bottom Action Buttons */}
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
        onAdd={handleAddNote}
      />
      <VoiceNoteModal
        isVisible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onSave={handleAddVoiceNote}
      />
      <CameraModal
        isVisible={isCameraModalVisible}
        onClose={() => setIsCameraModalVisible(false)}
        onCapture={handleCaptureImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  header: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 8,
  },
  tagContainer: {
    maxHeight: 35,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tag: {
    marginRight: 8,
  },
  notesList: {
    flex: 1,
    padding: 16,
  },

  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    //transparent bg
    backgroundColor: "rgba(255, 255, 255, 1)",
    // borderTopWidth: 1,
    // borderTopColor: "#f0f0f0",
  },
  fab: {
    margin: 8,
    shadowColor: "transparent",
  },
});

export default HomeScreen;
