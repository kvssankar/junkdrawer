import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import Modal from "react-native-modal";

const AddNoteModal = ({ isVisible, onClose, onAdd }) => {
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAdd(noteText);
      setNoteText("");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Note</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type your note..."
          value={noteText}
          onChangeText={setNoteText}
          placeholderTextColor="#999"
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleAddNote}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Add Note
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
    fontFamily: "SpaceMono",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    fontFamily: "Poppins",
  },
  textInput: {
    height: 150,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  button: {
    marginLeft: 10,
  },
  buttonLabel: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default AddNoteModal;
