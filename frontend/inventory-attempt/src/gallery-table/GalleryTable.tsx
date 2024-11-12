import React, { useState } from "react";
import { entryDataType } from "../main-table/MainTable";
import { ImageList, ImageListItem } from "@mui/material";

type PropsType = {
  entries: Array<entryDataType>;
};

export function GalleryTable(props: PropsType) {
  const [fullScreenImageId, setFullScreenImageId] = useState(null);

  const toggleFullScreen = (id: any) => {
    setFullScreenImageId(id === fullScreenImageId ? null : id);
  };
  return (
    <div>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {props.entries.map((item) => {
          return (
            <ImageListItem key={item.imgUrl}>
              <img
                className={"thumbnail"}
                onClick={() => toggleFullScreen(item.id)}
                srcSet={`${item.imgUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.imgUrl}?w=164&h=164&fit=crop&auto=format`}
                alt={item.imgUrl}
                loading="eager"
              />
            </ImageListItem>
          );
        })}
        {fullScreenImageId !== null && (
          <div className="overlay" onClick={() => toggleFullScreen(null)}>
            <img src={props.entries.find((img) => img.id === fullScreenImageId)?.imgUrl} className="full-screen" />
          </div>
        )}
      </ImageList>
    </div>
  );
}
