import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Notifications, Logout } from '@mui/icons-material';

interface TopbarProps {
  open: boolean;
  drawerWidthExpanded: number;
  drawerWidthCollapsed: number;
}

export default function Topbar({
  open,
  drawerWidthExpanded,
  drawerWidthCollapsed,
}: TopbarProps) {
  const drawerWidth = open ? drawerWidthExpanded : drawerWidthCollapsed;

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: '#1976d2',
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          HCyA
        </Typography>
        <div>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <Logout />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
