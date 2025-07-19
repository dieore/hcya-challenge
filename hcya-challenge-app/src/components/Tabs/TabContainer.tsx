import { Tabs, Tab, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveTab, closeTab } from "../../store/tabs/tabsSlice";
import { sidebarItems } from "../Layout/SidebarItems";

export default function TabContainer() {
  const { tabs, activeTabId } = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Tabs
        value={activeTabId}
        onChange={(_, val) => dispatch(setActiveTab(val))}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={
              <Box display="flex" alignItems="center">
                {tab.label}
                <Box
                  component="span"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(closeTab(tab.id));
                  }}
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label={`Cerrar ${tab.label}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      dispatch(closeTab(tab.id));
                    }
                  }}
                >
                  <Close fontSize="small" />
                </Box>
              </Box>
            }
            value={tab.id}
          />
        ))}
      </Tabs>

      <Box flexGrow={1} overflow="auto" p={2}>
        {tabs.map((tab) => {
          if (tab.id !== activeTabId) return null;
          const activeItem = sidebarItems.find((item) => item.id === tab.id);
          return activeItem ? (
            <Box key={tab.id}>{activeItem.component}</Box>
          ) : null;
        })}
      </Box>
    </Box>
  );
}
