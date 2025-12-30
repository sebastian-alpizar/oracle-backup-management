import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Backup as BackupIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { SchedulerProvider } from './context/SchedulerContext';
import Dashboard from './pages/Dashboard';
import BackupsPage from './pages/BackupsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

const drawerWidth = 240;
const collapsedWidth = 64;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Estrategias', icon: <BackupIcon />, path: '/backups' },
  { text: 'Logs', icon: <HistoryIcon />, path: '/logs' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
];

const NavigationDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const PermanentDrawer = ({open, onToggle}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: 'hidden',
          transition: 'width 0.3s',
        },
      }}
      open
    >
      <Toolbar 
        sx={{
          display: 'flex',
          justifyContent: open ? 'flex-end' : 'center',
        }}
      >
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeft/> : <ChevronRight/>}
        </IconButton>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <Tooltip title={!open ? item.text : ''} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {open && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            md: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)`
          },
          ml: {
            md: `${drawerOpen ? drawerWidth : collapsedWidth}px`
          },
          transition: 'width 0.3s, margin 0.3s',
        }}
      >
        <Toolbar>          
          <Typography variant="h6" noWrap component="div">
            Sistema de Gestión de Respaldo Oracle
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <NavigationDrawer open={drawerOpen} onClose={toggleDrawer} />
        <PermanentDrawer open={drawerOpen} onToggle={toggleDrawer} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)` },
          transition: 'width 0.3s',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/backups" element={<BackupsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <ConfigProvider>
            <SchedulerProvider>
              <AppContent />
            </SchedulerProvider>
          </ConfigProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;