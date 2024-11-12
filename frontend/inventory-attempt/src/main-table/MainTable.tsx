import { Button } from "@mui/material";
import React from "react";
export type entryDataType = {
  id: number;
  name: string;
  comesFrom: string;
  imgUrl: string;
};

type PropsType = {
  entries: Array<entryDataType>;
};

export function MainTable(props: PropsType) {
  return (
    <div>
      {props.entries.map((i) => {
        return (
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                alert("action");
              }}>
              Id: {i.id}. Name: {i.name}. Comes From: {i.comesFrom}.
            </Button>
          </div>
        );
      })}
    </div>
  );
}
