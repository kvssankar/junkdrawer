// app/editvoicenote.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Chip,
  Text,
  ProgressBar,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";

type NoteType = "text" | "voice";

interface VoiceNote {
  id?: string;
  title: string;
  content: string; // Text description
  audioUri: string; // Path to the audio file
  tags: string[];
  date: Date;
  type: NoteType;
}

export default function EditVoiceNote() {
  const { note: noteParam } = useLocalSearchParams();
  const noteData: VoiceNote = noteParam
    ? JSON.parse(noteParam as string)
    : {
        title: "",
        content: "",
        audioUri: "",
        tags: [],
        date: new Date(),
        type: "voice",
      };

  const [title, setTitle] = useState(noteData.title || "");
  const [content, setContent] = useState(noteData.content || "");
  const [tags, setTags] = useState(noteData.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Audio player state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  // Load sound on component mount
  useEffect(() => {
    let isMounted = true;

    async function loadSound() {
      try {
        if (!noteData.audioUri) return;

        console.log("Loading sound from URI:", noteData.audioUri);

        // Unload any existing sound
        if (sound) {
          await sound.unloadAsync();
        }

        // Load new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: noteData.audioUri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        // Only update state if component is still mounted
        if (isMounted) {
          setSound(newSound);
          setLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load audio", error);
        Alert.alert("Audio Error", "Could not load the audio file.");
      }
    }

    loadSound();

    // Cleanup function
    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [noteData.audioUri]);

  // Track playback status
  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    // Update duration once when loaded
    if (status.isLoaded && duration === 0) {
      setDuration(status.durationMillis || 0);
    }

    // Update position during playback
    setPosition(status.positionMillis || 0);

    // Update playing state
    setIsPlaying(status.isPlaying);

    // Handle playback completion
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

        // If playback finished, start from beginning
        if (status.positionMillis === status.durationMillis) {
          await sound.setPositionAsync(0);
        }

        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error controlling playback", error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

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
    const updatedNote = {
      ...noteData,
      title,
      content,
      tags,
      date: new Date(),
    };
    console.log("Updated Voice Note:", updatedNote);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={title || "Edit Voice Note"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />

        <View style={styles.audioPlayerContainer}>
          <View style={styles.audioControlsRow}>
            <Button
              icon={isPlaying ? "pause" : "play"}
              mode="contained"
              onPress={handlePlayPause}
              disabled={!loaded}
              style={styles.playButton}
              contentStyle={styles.playButtonContent}
            />

            <View style={styles.progressSection}>
              <ProgressBar
                progress={duration > 0 ? position / duration : 0}
                style={styles.progressBar}
              />

              <View style={styles.timeInfo}>
                <Text>{formatTime(position)}</Text>
                <Text>{formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        </View>

        <TextInput
          label="Description"
          mode="outlined"
          value={content}
          onChangeText={setContent}
          multiline
          style={[styles.input, { height: 150 }]}
          outlineStyle={styles.inputOutline}
        />

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
    paddingBottom: 100,
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
  audioPlayerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  audioControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    marginRight: 12,
    width: 28,
    height: 38,
  },
  playButtonContent: {
    height: 38,
  },
  progressSection: {
    flex: 1,
    justifyContent: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 20,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addTagButton: {
    marginTop: 7,
    marginLeft: 8,
    borderRadius: 8,
    height: 40,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    marginBottom: 8,
  },
});
