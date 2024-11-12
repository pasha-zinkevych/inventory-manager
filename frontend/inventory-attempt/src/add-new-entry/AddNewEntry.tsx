import { Box, Button, TextField } from "@mui/material";
import { MouseEventHandler } from "react";

interface AddNewEntryProps {
  onAddNewEntry: (event: React.SyntheticEvent, newValue: string) => void;
}

const AddNewEntry: React.FC<AddNewEntryProps> = ({ onAddNewEntry }) => {
  const handleClick = (event: React.SyntheticEvent) => {
    const newValue = "2"; // Replace this with the actual value you want to pass
    onAddNewEntry(event, newValue);
  };
  return (
    <div>
      <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Name" variant="outlined" />
          <TextField id="outlined-basic" label="Comes From" variant="outlined" />
          <TextField id="outlined-basic" label="Images" variant="outlined" />
        </Box>
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
          <Button variant="outlined">Add Field</Button>
          <Button variant="contained" onClick={handleClick}>
            Create
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AddNewEntry;
