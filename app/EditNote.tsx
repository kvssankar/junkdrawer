// app/editnote.tsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
import { Appbar, TextInput, Button, Chip } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditNote() {
  // Retrieve the note from URL parameters (passed as JSON string)
  const { note: noteParam } = useLocalSearchParams();
  const noteData = noteParam ? JSON.parse(noteParam) : {};

  const [title, setTitle] = useState(noteData.title || "");
  const [content, setContent] = useState(noteData.content || "");
  const [tags, setTags] = useState(noteData.tags || []);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const updatedNote = { ...noteData, title, content, tags };
    console.log("Updated Note:", updatedNote);
    // Implement your save logic here (e.g., API call or state update)
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and note title */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={noteData.title || "Edit Note"} />
      </Appbar.Header>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
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

        {/* Tag input row */}
        <View style={styles.tagRow}>
          <TextInput
            label="Add Tag"
            mode="outlined"
            value={tagInput}
            onChangeText={setTagInput}
            style={[styles.input, { flex: 1, height: 40, marginBottom: 0 }]}
            outlineStyle={styles.inputOutline}
          />
          <Button mode="contained" onPress={addTag} style={styles.addTagButton}>
            Add
          </Button>
        </View>

        {/* Display added tags */}
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              onClose={() => removeTag(tag)}
              style={styles.chip}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </ScrollView>

      {/* Footer with Save and Cancel buttons */}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space so content doesn't hide behind footer
  },
  input: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputOutline: {
    borderColor: "transparent",
    borderWidth: 0,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    // height: 40, // To align with the TextInput height
  },
  addTagButton: {
    marginTop: 7,
    marginLeft: 8,
    borderRadius: 8,
    height: 40, // To align with the TextInput height
    justifyContent: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  footerButton: {
    marginBottom: 8,
  },
});
