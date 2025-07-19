import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TabContainer from "../Tabs/TabContainer";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 60;

export default function MainLayout() {
  const [open, setOpen] = useState(true);
  const currentDrawerWidth = open ? drawerWidthExpanded : drawerWidthCollapsed;

  return (
    <Box display="flex" height="100vh">
      <Sidebar
        open={open}
        setOpen={setOpen}
        drawerWidthExpanded={drawerWidthExpanded}
        drawerWidthCollapsed={drawerWidthCollapsed}
      />

      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        sx={{
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Topbar
          open={open}
          drawerWidthExpanded={drawerWidthExpanded}
          drawerWidthCollapsed={drawerWidthCollapsed}
        />

        <Box
          flexGrow={1}
          overflow="hidden"
          sx={{
            mt: "64px",
          }}
        >
          <TabContainer />
        </Box>
      </Box>
    </Box>
  );
}
