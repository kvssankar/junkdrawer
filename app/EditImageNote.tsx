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
import { Appbar, TextInput, Button, Text, Chip } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

const EditImageNote = () => {
  const { note: noteParam } = useLocalSearchParams();
  const noteData = noteParam ? JSON.parse(noteParam) : {};

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  // State for all editable fields
  const [title, setTitle] = useState(noteData.title || "");
  const [content, setContent] = useState(noteData.content || "");
  const [tags, setTags] = useState(noteData.tags || []);
  const [newTag, setNewTag] = useState("");
  const [reminderDate, setReminderDate] = useState(
    noteData.reminder_datetime
      ? new Date(noteData.reminder_datetime)
      : undefined
  );

  const handleSave = () => {
    const updatedNote = {
      ...noteData,
      title,
      content,
      tags,
      reminder_datetime: reminderDate?.toISOString(),
    };
    console.log("Saving note:", updatedNote);
    // Implement your API call here to save the note
    router.back();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edit Note" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
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
          style={[styles.input, { height: 200 }]}
          outlineStyle={styles.inputOutline}
        />

        {/* Reminder Date Section */}
        <View style={styles.reminderSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reminder Date & Time
          </Text>
          <DatePickerInput
            locale="en"
            label="Reminder date"
            value={reminderDate}
            onChange={(date) => setReminderDate(date)}
            inputMode="start"
            mode="outlined"
            style={styles.dateInput}
          />
        </View>

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tags
          </Text>
          <View style={styles.tagInput}>
            <TextInput
              mode="outlined"
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add new tag"
              style={{ flex: 1 }}
              right={<TextInput.Icon icon="plus" onPress={handleAddTag} />}
              onSubmitEditing={handleAddTag}
            />
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                mode="outlined"
                onClose={() => handleRemoveTag(tag)}
                style={styles.chip}
              >
                {tag}
              </Chip>
            ))}
          </View>
        </View>
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
  sectionTitle: {
    marginBottom: 8,
  },
  reminderSection: {
    marginBottom: 16,
  },
  dateInput: {
    marginTop: 8,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagInput: {
    flexDirection: "row",
    marginVertical: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    margin: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
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
