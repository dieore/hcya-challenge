import { Tabs, Tab, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveTab, closeTab } from "../../store/tabs/tabsSlice";
import { openModal } from '../../store/modal/modalSlice';
import { setDirtyState } from '../../store/dirty/dirtySlice';
import { sidebarItems } from "../Layout/SidebarItems";

export default function TabContainer() {
  const { tabs, activeTabId } = useAppSelector((state) => state.tabs);
  const dirtyState = useAppSelector((state) => state.dirty);
  const dispatch = useAppDispatch();

  const handleCloseTab = (tabId: string) => {
    const isDirty = Object.keys(dirtyState).find((model) => model === tabId) && Object.values(dirtyState[tabId]).some((value) => value);

    if (isDirty) {
      dispatch(openModal({
        title: 'Descartar cambios',
        message: 'Tienes progreso en esta pestaña. ¿Estás seguro de que quieres cerrarla?',
        onConfirm: () => {
          dispatch(closeTab(tabId));
          Object.keys(dirtyState).forEach(key => {
            dispatch(setDirtyState({ model: tabId, key, isDirty: false }));
          });
        }
      }));
    } else {
      dispatch(closeTab(tabId));
    }
  };

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
                    handleCloseTab(tab.id);
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
                      handleCloseTab(tab.id);
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
          const tabItem = sidebarItems.find((item) => item.id === tab.id);
          if (!tabItem) return null;

          return (
            <Box
              key={tab.id}
              height="100%"
              width="100%"
              sx={{ display: tab.id === activeTabId ? "block" : "none" }}
            >
              {tabItem.component}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
