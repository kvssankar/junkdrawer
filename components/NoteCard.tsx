import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Text,
  Chip,
  Menu,
  IconButton,
  ProgressBar,
} from "react-native-paper";
import moment from "moment";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

const NoteCard = ({ note }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useRouter();
  const shimmerAnimation = new Animated.Value(-150);

  // Audio player state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    if (note.isProcessing) {
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 400,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      //stop animation
      shimmerAnimation.setValue(-150);
    }
  }, [note.isProcessing]);

  // Load sound for voice notes
  useEffect(() => {
    let isMounted = true;

    async function loadSound() {
      try {
        if (note.type !== "voice" || !note.audioUri) return;

        // Unload any existing sound
        if (sound) {
          await sound.unloadAsync();
        }

        // Load new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: note.audioUri },
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
      }
    }

    if (note.type === "voice") {
      loadSound();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [note.type, note.audioUri]);

  // Track playback status
  const onPlaybackStatusUpdate = (status) => {
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

  const handleEdit = () => {
    closeMenu();
    // Navigate to the appropriate edit screen based on note type
    if (note.type === "voice") {
      navigation.push({
        pathname: "/EditVoiceNote",
        params: { note: JSON.stringify(note) },
      });
    } else if (note.type === "image") {
      navigation.push({
        pathname: "/EditImageNote",
        params: { note: JSON.stringify(note) },
      });
    } else {
      navigation.push({
        pathname: "/EditNote",
        params: { note: JSON.stringify(note) },
      });
    }
  };

  const handleDelete = () => {
    closeMenu();
    // Implement your delete logic here (e.g., call an API or update state).
    console.log("Delete note with id:", note.id);
  };

  const renderNoteIcon = () => {
    switch (note.type) {
      case "voice":
        return (
          <Image
            source={require("../assets/images/music.png")}
            style={{ width: 40, height: 40 }}
          />
        );
      case "text":
        return (
          <Image
            source={require("../assets/images/pencil.png")}
            style={{ width: 40, height: 40 }}
          />
        );
      case "image":
        return (
          <Image
            source={require("../assets/images/image.png")}
            style={{ width: 40, height: 40 }}
          />
        );
      default:
        return (
          <MaterialCommunityIcons name="note-text" size={40} color="#555" />
        );
    }
  };

  return (
    <Card style={styles.noteCard}>
      <View style={styles.titleContainer}>
        {renderNoteIcon()}
        <View style={styles.titleTextContainer}>
          <Text style={styles.cardTitle}>{note.title}</Text>
          <Text style={styles.cardDate}>
            {moment(note.createdAt).calendar()}
          </Text>
        </View>
      </View>
      <Card.Content>
        {note.type === "voice" && (
          <View style={styles.audioPlayerContainer}>
            <TouchableOpacity
              onPress={handlePlayPause}
              disabled={!loaded}
              style={styles.playIconButton}
            >
              <MaterialCommunityIcons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={42}
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
            </View>
          </View>
        )}

        {note.type === "image" && note.imageUri && (
          <Image
            source={{ uri: note.imageUri }}
            style={styles.noteImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.noteContent}>{note.content}</Text>
        <View style={styles.noteTags}>
          {note.tags &&
            note.tags.map((tag, idx) => (
              <Chip
                key={idx}
                style={styles.noteTag}
                textStyle={styles.noteTagText}
              >
                {tag}
              </Chip>
            ))}
        </View>
      </Card.Content>

      {note.isProcessing && (
        <Animated.View
          style={[
            styles.shimmerContainer,
            {
              transform: [{ translateX: shimmerAnimation }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.6)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.shimmer}
          />
        </Animated.View>
      )}
    </Card>
  );
};

const styles = {
  noteCard: {
    backgroundColor: "rgba(241, 245, 245, 0.77)", // Light gray background
    shadowColor: "transparent",
    marginBottom: 16,
    borderRadius: 12, // Nicer border radius
    borderColor: "transparent",
    borderWidth: 1,
    overflow: "hidden", // Important to contain the shimmer effect
  },
  shimmerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: "100%",
    zIndex: 1,
  },
  shimmer: {
    width: "100%",
    height: "100%",
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  titleTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "Poppins_700Bold",
    marginTop: 2,
    color: "#333",
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 15,
  },
  noteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    // marginTop: 10,
  },
  noteTag: {
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
    borderWidth: 0.5,
  },
  noteTagText: {
    fontSize: 12,
    color: "#666",
  },
  // Custom progress bar styles
  audioPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  playIconButton: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    height: 24,
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
};

export default NoteCard;
