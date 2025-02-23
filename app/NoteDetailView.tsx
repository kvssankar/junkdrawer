import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Text, Button, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const NoteDetailView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [note, setNote] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Audio player state (similar to the NoteCard component)
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Parse the note data from params
    if (params.note) {
      try {
        const noteData = JSON.parse(params.note);
        setNote(noteData);
      } catch (error) {
        console.error("Error parsing note data:", error);
      }
    }
  }, []);

  // Load audio file if it's a voice note (similar to NoteCard)
  //   useEffect(() => {
  //     let isMounted = true;

  //     async function loadSound() {
  //       try {
  //         if (!note || note.type !== "voice" || !note.audioUri) return;

  //         if (sound) {
  //           await sound.unloadAsync();
  //         }

  //         const { sound: newSound } = await Audio.Sound.createAsync(
  //           { uri: note.audioUri },
  //           { shouldPlay: false },
  //           onPlaybackStatusUpdate
  //         );

  //         if (isMounted) {
  //           setSound(newSound);
  //           setLoaded(true);
  //         }
  //       } catch (error) {
  //         console.error("Failed to load audio", error);
  //       }
  //     }

  //     if (note && note.type === "voice") {
  //       loadSound();
  //     }

  //     return () => {
  //       isMounted = false;
  //       if (sound) {
  //         sound.unloadAsync();
  //       }
  //     };
  //   }, []);

  // Audio playback status tracking
  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    if (status.isLoaded && duration === 0) {
      setDuration(status.durationMillis || 0);
    }

    setPosition(status.positionMillis || 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = async () => {
    if (!sound || !loaded) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        const status = await sound.getStatusAsync();

        if (status.positionMillis === status.durationMillis) {
          await sound.setPositionAsync(0);
        }

        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error controlling playback", error);
    }
  };

  const handleEdit = () => {
    if (!note) return;

    // Navigate to the appropriate edit screen based on note type
    if (note.type === "voice") {
      router.push({
        pathname: "/EditImageNote",
        params: { note: JSON.stringify(note) },
      });
    } else if (note.type === "image") {
      router.push({
        pathname: "/EditImageNote",
        params: { note: JSON.stringify(note) },
      });
    } else {
      router.push({
        pathname: "/EditImageNote",
        params: { note: JSON.stringify(note) },
      });
    }
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Delete note with id:", note?._id);
    // After deletion, go back
    router.back();
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>{note.title}</Text>
        <View style={{ width: 40 }} /> {/* Spacer for balance */}
      </View>

      <ScrollView style={styles.content}>
        {/* Note creation date */}
        <Text style={styles.dateText}>
          {moment(note.createdAt).format("MMMM D, YYYY · h:mm A")}
        </Text>

        {/* Audio player for voice notes */}
        {note.type === "voice" && (
          <View style={styles.audioPlayerContainer}>
            <TouchableOpacity
              onPress={handlePlayPause}
              disabled={!loaded}
              style={styles.playIconButton}
            >
              <MaterialCommunityIcons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={50}
                color="#3498db"
              />
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(position / Math.max(duration, 1)) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.timeLabels}>
                <Text style={styles.timeLabel}>
                  {moment.utc(position).format("m:ss")}
                </Text>
                <Text style={styles.timeLabel}>
                  {moment.utc(duration).format("m:ss")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Images for image notes */}
        {note.type === "image" && note.images && note.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {note.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(image)}
              >
                <Image
                  source={{
                    uri: image.content.startsWith("data:")
                      ? image.content
                      : image.content,
                  }}
                  style={styles.noteImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Note content */}
        <Text style={styles.contentText}>{note.content}</Text>

        {/* Note summary */}
        {note.summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{note.summary}</Text>
          </View>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags</Text>
            <View style={styles.tagsList}>
              {note.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reminder indicator */}
        {note.reminder_datetime && (
          <View style={styles.reminderContainer}>
            <MaterialCommunityIcons name="bell" size={20} color="#555" />
            <Text style={styles.reminderText}>
              {moment(new Date(note.reminder_datetime)).format("MMM D, YYYY")}
            </Text>
          </View>
        )}

        {/* Spacer to ensure buttons don't cover content */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          mode="outlined"
          icon="pencil"
          onPress={handleEdit}
          style={styles.editButton}
        >
          Edit
        </Button>
        <Button
          mode="contained"
          icon="delete"
          onPress={handleDelete}
          style={styles.deleteButton}
          buttonColor="#ff5252"
        >
          Delete
        </Button>
      </View>

      {/* Fullscreen image modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          {selectedImage && (
            <Image
              source={{
                uri: selectedImage.content.startsWith("data:")
                  ? selectedImage.content
                  : selectedImage.content,
              }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
  },
  audioPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  playIconButton: {
    marginRight: 15,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e1e1e1",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: 4,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
  },
  imagesContainer: {
    marginBottom: 20,
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#3498db",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  tagText: {
    fontSize: 14,
    color: "#555",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reminderText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    borderColor: "#3498db",
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
  },
});

export default NoteDetailView;
