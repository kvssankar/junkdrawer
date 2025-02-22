// CameraModal.tsx with improved overlay for landscape mode
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  Dimensions,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CameraModal = ({ isVisible, onClose, onCapture }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState("back");
  const [caption, setCaption] = useState("");
  const [aspectRatio, setAspectRatio] = useState("landscape"); // default to portrait
  const camera = useRef(null);

  // Get screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

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
        // Get the frame processor's crop region coordinates
        const cropRegion = getCropRegion();

        const photo = await camera.current.takePhoto({
          flash: "off",
          enableShutterSound: false,
        });

        // Pass the crop region with the photo for later processing
        onCapture({
          uri: `file://${photo.path}`,
          caption,
          cropRegion,
        });

        setCaption("");
        onClose();
      } catch (error) {
        console.error("Failed to take photo:", error);
      }
    }
  };

  // Function to calculate crop region based on selected aspect ratio
  const getCropRegion = () => {
    if (aspectRatio === "landscape") {
      // Credit card/landscape ratio (roughly 1.6:1)
      const boxWidth = screenWidth; // Full width
      const boxHeight = boxWidth / 1.6; // Maintain credit card aspect ratio

      // Center vertically
      const centerY = screenHeight / 2;

      return {
        x: 0,
        y: centerY - boxHeight / 2,
        width: boxWidth,
        height: boxHeight,
      };
    } else {
      // portrait
      // Full screen/camera view
      return {
        x: 0,
        y: 0,
        width: screenWidth,
        height: screenHeight,
      };
    }
  };

  const toggleCameraPosition = () => {
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
  };

  // For rendering the overlay guide
  const renderCaptureOverlay = () => {
    // Only show overlay for landscape mode
    if (aspectRatio !== "landscape") return null;

    const cropRegion = getCropRegion();

    return (
      <View style={styles.overlayContainer}>
        {/* Top dimmed area */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: cropRegion.y,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />

        {/* Bottom dimmed area */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: screenHeight - (cropRegion.y + cropRegion.height),
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />

        {/* Border around the capture area */}
        <View
          style={[
            styles.captureBox,
            {
              left: cropRegion.x,
              top: cropRegion.y,
              width: cropRegion.width,
              height: cropRegion.height,
            },
          ]}
        />
      </View>
    );
  };

  if (!hasPermission) {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        style={styles.modal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
      >
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>Camera permission is required</Text>
          <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleRequestPermission}>
            Grant Permission
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

        {/* Capture box overlay */}
        {renderCaptureOverlay()}

        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraPosition}
        >
          <MaterialCommunityIcons name="camera-flip" size={24} color="white" />
        </TouchableOpacity>

        {/* Aspect ratio selection buttons */}
        <View style={styles.aspectRatioContainer}>
          <TouchableOpacity
            style={[
              styles.aspectRatioButton,
              aspectRatio === "landscape" && styles.selectedAspectRatio,
            ]}
            onPress={() => setAspectRatio("landscape")}
          >
            {/* Square icon for landscape */}
            <MaterialCommunityIcons
              name="rectangle-outline"
              size={29}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.aspectRatioButton,
              aspectRatio === "portrait" && styles.selectedAspectRatio,
            ]}
            onPress={() => setAspectRatio("portrait")}
          >
            {/* Vertical rectangle icon for portrait */}
            <MaterialCommunityIcons
              name="mirror-rectangle"
              size={29}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Add a caption (optional)"
            placeholderTextColor="#999"
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              buttonColor={"gray"}
              onPress={onClose}
              style={styles.closeButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCapture}
              style={styles.captureButton}
            >
              Capture
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  captureBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  flipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  flipText: {
    color: "white",
    fontWeight: "bold",
  },
  aspectRatioContainer: {
    position: "absolute",
    top: 90,
    right: 20,
    flexDirection: "column",
    zIndex: 10,
  },
  aspectRatioButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedAspectRatio: {
    backgroundColor: "rgba(0,120,255,0.7)",
  },
  aspectRatioText: {
    color: "white",
    fontSize: 12,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(80,80,80,0.9)",
    padding: 10,
    zIndex: 10,
  },
  textArea: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    color: "white",
    padding: 10,
    minHeight: 60,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  captureButton: {
    flex: 1,
    marginLeft: 10,
  },
  closeButton: {
    flex: 1,
    marginRight: 10,
  },
});

export default CameraModal;
