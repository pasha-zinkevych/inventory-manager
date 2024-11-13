import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Modal from "./new-field-window/Modal";

interface AddNewEntryProps {
  onAddNewEntry: (event: React.SyntheticEvent, newValue: string) => void;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddNewEntry: React.FC<AddNewEntryProps> = ({ onAddNewEntry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitle(e.currentTarget.value);
    setError(null);
  };
  const onCreateButtonHandler = (event: React.SyntheticEvent) => {
    if (title.trim() !== "") {
      setTitle("");
      const newValue = "2"; // Replace this with the actual value you want to pass
      onAddNewEntry(event, newValue);
    } else {
      setError("Incorrect Entry");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
          <TextField
            onChange={onNewTitleChangeHandler}
            value={title}
            error={error ? true : false}
            helperText={error ? "Required" : ""}
            id="outlined-basic"
            label="Name"
            variant="outlined"
          />
          <TextField
            error={error ? true : false}
            helperText={error ? "Required" : ""}
            id="outlined-basic"
            label="Comes From"
            variant="outlined"
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            color="success"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}>
            Upload Images
            <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
          </Button>
        </Box>
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
          <Button variant="outlined" onClick={openModal}>
            Add Field
          </Button>

          {isModalOpen && (
            <Modal onClose={closeModal}>
              <h2>Type in new parameter and value for it.</h2>
            </Modal>
          )}
          <Button variant="contained" onClick={onCreateButtonHandler}>
            Create
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AddNewEntry;
