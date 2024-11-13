import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; // CSS for styling the modal (optional)
import { Box, Button, TextField } from "@mui/material";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Field Name" variant="outlined" />
          <TextField id="outlined-basic" label="Field Value" variant="outlined" />
        </Box>
        <Button variant="contained" color="success" onClick={onClose}>
          Add
        </Button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
