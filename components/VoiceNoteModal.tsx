// VoiceNoteModal.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { Audio } from "expo-av"; // Make sure to install expo-av
import LottieView from "lottie-react-native"; // And lottie-react-native
import * as FileSystem from "expo-file-system";

const VoiceNoteModal = ({ isVisible, onClose, onSave }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState("");

  useEffect(() => {
    if (isVisible) {
      startRecording();
    } else {
      // If the modal is closed externally, ensure recording is stopped.
      if (recording) stopRecording();
    }
    // Cleanup on unmount
    return () => {
      if (recording) stopRecording();
    };
  }, [isVisible]);

  // In VoiceNoteModal.tsx, update startRecording
  const startRecording = async () => {
    try {
      // Request permission and set the audio mode
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Use better quality settings that are more compatible
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await rec.startAsync();
      setRecording(rec);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedUri(uri || "");
        setRecording(null);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handleSave = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const tempUri = recording.getURI();

        if (tempUri) {
          // Create a more permanent directory for audio files
          const audioDir = `${FileSystem.documentDirectory}audio/`;

          // Ensure the directory exists
          const dirInfo = await FileSystem.getInfoAsync(audioDir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(audioDir, {
              intermediates: true,
            });
          }

          // Generate a unique filename
          const fileName = `voice-note-${new Date().getTime()}.m4a`;
          const permanentUri = `${audioDir}${fileName}`;

          // Copy the file to a more permanent location
          await FileSystem.copyAsync({
            from: tempUri,
            to: permanentUri,
          });

          console.log("Recording saved permanently at:", permanentUri);

          // Create a new voice note object with the permanent URI
          const newVoiceNote = {
            title: "New Voice Note",
            content: "", // Empty description initially
            audioUri: permanentUri,
            tags: ["Voice"],
            createdAt: new Date(),
            type: "voice", // Identify this as a voice note
            isProcessing: false,
          };

          setRecording(null);
          onSave(newVoiceNote);
        } else {
          console.error("No URI available for the recording");
        }
      }
    } catch (err) {
      console.error("Error saving recording", err);
    }
  };

  const handleCancel = async () => {
    await stopRecording();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.animationContainer}>
          {/* Lottie animation for the mic; ensure you have a mic animation JSON file */}
          <LottieView
            source={require("../assets/mic-animation-2.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleCancel} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
    alignItems: "center",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 150,
    height: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default VoiceNoteModal;
