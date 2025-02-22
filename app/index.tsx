import AddNoteModal from "@/components/AddNoteModal";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Searchbar, Chip, FAB } from "react-native-paper";
import NoteCard from "@/components/NoteCard";
import VoiceNoteModal from "@/components/VoiceNoteModal";
import CameraModal from "@/components/CameraModal";
import { fetchNotes } from "@/services/notes"; 

const HomeScreen = () => {
  const tags = ["All Tags", "Finance", "Health", "Learning", "Sankar"];
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

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
        isProcessing: true,
      },
      ...notes,
    ]);
    setTimeout(() => {
      setNotes((prevState) => {
        //if prev state has same id then update the title or else create a new note
        const noteWithId = prevState.find((note) => note.id === id);
        if (noteWithId) {
          noteWithId.title = "New Text Note " + noteText;
          noteWithId.isProcessing = false;
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
              isProcessing: false,
            },
          ];
        }
      });
    }, 3000);
    setIsTextModalVisible(false);
  };

  const handleImageNote = (imageUri, caption) => {
    const id = getRandId();
    setNotes([
      {
        id: id,
        title: "Processing...",
        content: caption,
        imageUri: imageUri,
        tags: [],
        date: new Date(),
        type: "image",
        isProcessing: true,
      },
      ...notes,
    ]);
    setTimeout(() => {
      setNotes((prevState) => {
        const noteWithId = prevState.find((note) => note.id === id);
        if (noteWithId) {
          noteWithId.title = "New Image Note";
          noteWithId.isProcessing = false;
          return [...prevState];
        } else {
          return [
            ...prevState,
            {
              id: id,
              title: "New Image Note",
              content: caption,
              imageUri: imageUri,
              tags: [],
              date: new Date(),
              type: "image",
              isProcessing: false,
            },
          ];
        }
      });
    }, 3000);
    setIsCameraModalVisible(false);
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
        {loading ? (
          <Text style={styles.loadingText}>Loading notes...</Text>
        ) : notes.length > 0 ? (
          notes.map((note, index) => (
            <NoteCard key={index} note={note} />
          ))
        ) : (
          <Text style={styles.emptyText}>No notes found</Text>
        )}
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
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#888',
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 20,
  },
  fab: {
    borderRadius: 0,
    backgroundColor: "rgb(69, 129, 240)",
    color: "white",
    shadowColor: "transparent",
  },
});

export default HomeScreen;