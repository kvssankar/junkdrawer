// CameraModal.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";

const CameraModal = ({ isVisible, onClose, onCapture }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState("back");
  const camera = useRef(null);

  const handleRequestPermission = async () => {
    try {
      const newStatus = await requestPermission();
      console.log("New permission status:", newStatus);
      if (!newStatus) {
        Linking.openSettings();
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  const device = useCameraDevice(cameraPosition);

  useEffect(() => {
    if (isVisible && !hasPermission) {
      requestPermission();
    }
  }, [isVisible, hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        onCapture(`file://${photo.path}`);
        onClose();
      } catch (error) {
        console.error("Failed to take photo:", error);
      }
    }
  };

  const toggleCameraPosition = () => {
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!hasPermission) {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        style={styles.modal}
      >
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>Camera permission is required</Text>
          <Button mode="contained" onPress={handleRequestPermission}>
            Grant Permission
          </Button>
          <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
            Cancel
          </Button>
        </View>
      </Modal>
    );
  }

  if (!device) {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        style={styles.modal}
      >
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>No camera device found</Text>
          <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
            Close
          </Button>
        </View>
      </Modal>
    );
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isVisible}
          photo={true}
        />
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraPosition}
        >
          <Text style={styles.flipText}>Flip</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCapture}
            style={styles.captureButton}
          >
            Capture
          </Button>
          <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Removes default margin so modal takes full screen
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
    position: "relative",
  },
  permissionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  flipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  flipText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  captureButton: {
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    flex: 1,
    marginLeft: 10,
  },
});

export default CameraModal;
