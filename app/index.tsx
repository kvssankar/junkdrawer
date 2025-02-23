import AddNoteModal from "@/components/AddNoteModal";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Searchbar, Chip, FAB, Text } from "react-native-paper";
import NoteCard from "@/components/NoteCard";
import VoiceNoteModal from "@/components/VoiceNoteModal";
import CameraModal from "@/components/CameraModal";
import { createNote, fetchNotes } from "@/services/notes";

const HomeScreen = () => {
  // In HomeScreen.tsx
  const tagMapping = {
    Events: "Events/Posters",
    Private: "Phone/Email/Secrets", // or 'Private' if you prefer
  };

  const tags = [
    "All",
    "Reminders",
    "Events",
    "Work",
    "Urls",
    "Private", // or 'Private'
    "Lists",
    "Others",
  ];

  const getFilteredNotes = () => {
    if (selectedTag === "All") {
      return notes;
    }
    const categoryToFilter = tagMapping[selectedTag] || selectedTag;
    return notes.filter(
      (note) =>
        note.folder_category && note.folder_category.includes(categoryToFilter)
    );
  };

  const [selectedTag, setSelectedTag] = useState("All");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error refreshing notes:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Fetch notes when component mounts
  useEffect(() => {
    const getNotes = async () => {
      try {
        setLoading(true);
        const fetchedNotes = await fetchNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  const handleTagPress = (tag) => {
    setSelectedTag(tag);
  };

  const getRandId = () => Math.floor(Math.random() * 1000);

  const handleAddTextNote = async (noteText) => {
    const id = getRandId();
    const note = {
      tempid: id,
      title: "Processing...",
      content: noteText,
      tags: [],
      createdAt: new Date(),
      type: "text",
      isProcessing: true,
    };

    setNotes([note, ...notes]);
    setIsTextModalVisible(false);

    try {
      const newNote = await createNote(note);
      setNotes((prevState) => {
        const noteWithId = prevState.find((note) => newNote.tempid === id);
        if (noteWithId) {
          noteWithId.title = newNote.title;
          noteWithId.content = newNote.content;
          noteWithId.tags = newNote.tags;
          noteWithId.createdAt = newNote.createdAt;
          noteWithId.summary = newNote.summary;
          noteWithId.isProcessing = false;
          return [...prevState];
        } else {
          return [...prevState, newNote];
        }
      });
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleImageNote = async (imageUri, caption) => {
    const id = getRandId();
    const note = {
      tempid: id,
      title: "Processing...",
      content: caption,
      images: [
        {
          type: "jpeg",
          content: imageUri,
        },
      ],
      tags: [],
      createdAt: new Date(),
      type: "image",
      isProcessing: true,
    };
    setNotes([note, ...notes]);
    setIsCameraModalVisible(false);

    try {
      const newNote = await createNote(note);
      setNotes((prevState) => {
        const noteWithId = prevState.find((note) => newNote.tempid === id);
        if (noteWithId) {
          noteWithId.title = newNote.title;
          noteWithId.content = newNote.content;
          noteWithId.tags = newNote.tags;
          noteWithId.createdAt = newNote.createdAt;
          noteWithId.images = newNote.images;
          noteWithId.isProcessing = false;
          noteWithId.summary = newNote.summary;
          return [...prevState];
        } else {
          return [...prevState, newNote];
        }
      });
    } catch (error) {
      console.error("Error creating note:", error);
    }
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

      <ScrollView
        style={styles.notesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["rgb(69, 129, 240)"]} // Android
            tintColor="rgb(69, 129, 240)" // iOS
          />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading notes...</Text>
        ) : getFilteredNotes().length > 0 ? (
          getFilteredNotes().map((note, index) => (
            <NoteCard key={index} note={note} />
          ))
        ) : (
          <Text style={styles.emptyText}>No notes found</Text>
        )}
      </ScrollView>

      {/* <View style={{ height: 80 }} /> */}

      <View style={styles.bottomActions}>
        {/* <FAB
          icon="microphone"
          style={[
            styles.fab,
            { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
          ]}
          color="white"
          small
          onPress={() => setIsVoiceModalVisible(true)}
        /> */}
        <FAB
          icon="text"
          style={styles.fab}
          style={[
            styles.fab,
            { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
          ]}
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
        onCapture={handleImageNote}
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
    // paddingBottom: 80,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#888",
  },
  bottomActions: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center", // Center it horizontally
    flexDirection: "row",
    justifyContent: "center",
    // padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Light translucent background
    borderRadius: 50,
    elevation: 8, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  fab: {
    borderRadius: 0,
    backgroundColor: "rgb(69, 129, 240)",
    color: "white",
    shadowColor: "transparent",
  },
});

export default HomeScreen;
