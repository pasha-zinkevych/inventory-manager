import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import EntryTable from "../entry-table/EntryTable";
export type EntryDataType = {
  id: number;
  name: string;
  comesFrom: string;
  imgUrl: string;
};

type PropsType = {
  entry: Array<EntryDataType>;
};

export function MainTable(props: PropsType) {
  const [activeEntryTable, setActiveEntryTable] = useState<number | null>(null);

  const handleToggleEntryTable = (id: number) => {
    setActiveEntryTable((prevId) => (prevId === id ? null : id));
  };

  return (
    <Box component="form" sx={{ "& > :not(style)": { m: 2, width: "75%" } }} noValidate autoComplete="off">
      {props.entry.map((item) => {
        return (
          <div key={item.id}>
            <Button color="primary" variant="contained" onClick={() => handleToggleEntryTable(item.id)}>
              {activeEntryTable === item.id ? "Hide" : "Show"} Id: {item.id}. Name: {item.name}. Comes From:{" "}
              {item.comesFrom}.
            </Button>

            {activeEntryTable === item.id && <EntryTable entry={item} />}
          </div>
        );
      })}
    </Box>
  );
}
