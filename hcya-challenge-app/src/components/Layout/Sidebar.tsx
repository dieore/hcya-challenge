import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Menu, ChevronLeft } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { addTab } from "../../store/tabs/tabsSlice";
import { sidebarItems } from "./SidebarItems";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  drawerWidthExpanded: number;
  drawerWidthCollapsed: number;
}

export default function Sidebar({
  open,
  setOpen,
  drawerWidthExpanded,
  drawerWidthCollapsed,
}: SidebarProps) {
  const dispatch = useAppDispatch();

  const handleOpenTab = (id: string, label: string) => {
    dispatch(addTab({ id, label }));
  };
  
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthExpanded : drawerWidthCollapsed,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          px: [1],
        }}
      >
        <IconButton onClick={() => setOpen(!open)} size="small">
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </Toolbar>

      <List>
        {sidebarItems.map(({ id, label, icon }) => (
          <ListItemButton
            key={id}
            onClick={() => handleOpenTab(id, label)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            {open && <ListItemText primary={label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
