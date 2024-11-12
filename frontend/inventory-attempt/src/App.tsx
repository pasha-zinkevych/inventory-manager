import React from "react";
import "./App.css";
import { Tab, Box } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { GalleryTable } from "./gallery-table/GalleryTable";
import { SearchTable } from "./search-table/SearchTable";
import { entryDataType, MainTable } from "./main-table/MainTable";
import AddNewEntry from "./add-new-entry/AddNewEntry";

const entryData: Array<entryDataType> = [
  { id: 1, name: "Test1", comesFrom: "zalupa1", imgUrl: "https://picsum.photos/100" },
  { id: 2, name: "Test2", comesFrom: "zalupa2", imgUrl: "https://picsum.photos/200" },
  { id: 3, name: "Test3", comesFrom: "zalupa3", imgUrl: "https://picsum.photos/300" },
];

const App: React.FC = () => {
  const [value, setValue] = React.useState("2");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  console.log(value);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="lab API tabs example">
            <Tab label="Add New" value="1" />
            <Tab label="Table" value="2" />
            <Tab label="Gallery" value="3" />
            <Tab label="Search..." value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <AddNewEntry onAddNewEntry={handleChange} />
        </TabPanel>
        <TabPanel value="2">
          <MainTable entries={entryData} />
        </TabPanel>
        <TabPanel value="3">
          <GalleryTable entries={entryData} />
        </TabPanel>
        <TabPanel value="4">
          <SearchTable />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default App;
