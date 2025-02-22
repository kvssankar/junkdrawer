// CameraModal.tsx with base64 support
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";

const CameraModal = ({ isVisible, onClose, onCapture }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState("back");
  const [caption, setCaption] = useState("");
  const [aspectRatio, setAspectRatio] = useState("portrait");
  const [capturedImage, setCapturedImage] = useState(null); // Store captured image
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setCapturedImage(null);
      setCaption("");
    }
  }, [isVisible]);

  // Function to convert image file to base64
  const getBase64FromUri = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(base64.substring(0, 20));
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const handleTakePhoto = async () => {
    if (camera.current) {
      try {
        // Get the frame processor's crop region coordinates
        const cropRegion = getCropRegion();

        const photo = await camera.current.takePhoto({
          flash: "off",
          enableShutterSound: false,
        });

        const photoUri = `file://${photo.path}`;

        // Convert the photo to base64
        const base64 = await getBase64FromUri(photoUri);

        // Format base64 string with prefix for direct use in Image components
        const base64Uri = `data:image/jpeg;base64,${base64}`;

        // Store captured image in state
        setCapturedImage(base64Uri);
      } catch (error) {
        console.error("Failed to take photo:", error);
      }
    }
  };

  const handleSave = () => {
    // Pass both the URI and caption to parent component
    onCapture(capturedImage, caption);
    setCaption("");
    setCapturedImage(null);
    onClose();
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setCaption("");
    onClose();
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
      {capturedImage ? (
        // Review screen (after photo is taken)
        <View style={styles.modalContent}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          <View style={styles.captionContainer}>
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
                onPress={handleCancel}
                style={styles.closeButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.captureButton}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      ) : (
        // Camera screen
        <View style={styles.modalContent}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={isVisible && !capturedImage}
            photo={true}
          />

          {/* Capture box overlay */}
          {renderCaptureOverlay()}

          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraPosition}
          >
            <MaterialCommunityIcons
              name="camera-flip"
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.cameraButtonContainer}>
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
              onPress={handleTakePhoto}
              style={styles.captureButton}
            >
              Take Photo
            </Button>
          </View>
        </View>
      )}
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
  previewImage: {
    flex: 1,
    resizeMode: "contain",
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
  captionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    zIndex: 10,
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 5,
    // color: "white",
    padding: 10,
    minHeight: 60,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cameraButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
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
