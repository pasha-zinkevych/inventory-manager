import React from "react";
import { EntryDataType } from "../main-table/MainTable";

interface EntryTableProps {
  entry: EntryDataType;
}

const EntryTable: React.FC<EntryTableProps> = ({ entry }) => {
  return (
    <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
      <h2>Entry Table for {entry.name}</h2>
      <p>Comes from: {entry.comesFrom}</p>
      <img src={entry.imgUrl} alt={entry.name} style={{ width: "100px", height: "auto" }} />
    </div>
  );
};

export default EntryTable;
