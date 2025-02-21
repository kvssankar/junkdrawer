// EditImageNote.tsx
import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, TextInput, Button, Text } from "react-native-paper";

const EditImageNote = () => {
  // Assume noteData is passed via route parameters
  const { note: noteParam } = useLocalSearchParams();
  const noteData = noteParam ? JSON.parse(noteParam) : {};

  // For full-screen image modal
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  // State for note title and content
  const [title, setTitle] = useState(noteData.title || "");
  const [content, setContent] = useState(noteData.content || "");

  // Save handler (add your saving logic here)
  const handleSave = () => {
    console.log("Saving note with", { title, content });
    // Implement your saving logic then navigate back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={noteData.title || "Edit Note"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Display image if available and if the note type is image */}
        {noteData.type === "image" && noteData.imageUri && (
          <>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={{ uri: noteData.imageUri }}
                style={{
                  width: screenWidth,
                  height: screenWidth,
                  resizeMode: "cover",
                }}
              />
            </TouchableOpacity>
            {/* Full-screen image modal */}
            <Modal
              isVisible={isImageModalVisible}
              onBackdropPress={() => setImageModalVisible(false)}
              style={{ margin: 0 }}
            >
              <TouchableOpacity
                style={styles.fullScreenImageContainer}
                onPress={() => setImageModalVisible(false)}
              >
                <Image
                  source={{ uri: noteData.imageUri }}
                  style={styles.fullScreenImage}
                />
              </TouchableOpacity>
            </Modal>
          </>
        )}

        {/* Text inputs for Title and Content */}
        <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />
        <TextInput
          label="Content"
          mode="outlined"
          value={content}
          onChangeText={setContent}
          multiline
          style={[styles.input, { height: 320 }]}
          outlineStyle={styles.inputOutline}
        />
        {/* You can add additional fields (like tag inputs) here */}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.footerButton}
        >
          Save
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.footerButton}
        >
          Cancel
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputOutline: {
    borderRadius: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default EditImageNote;
