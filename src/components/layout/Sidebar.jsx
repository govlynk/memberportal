import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuLinks } from '../../config/menu-links';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DRAWER_WIDTH = 280;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderMenuItem = (item) => {
    const isCategory = item.links && item.links.length > 0;
    const isSelected = location.pathname === item.path;
    const Icon = item.icon;

    if (isCategory) {
      return (
        <Box key={item.id}>
          <ListItemButton onClick={() => toggleCategory(item.id)}>
            <ListItemIcon>
              <Icon size={24} />
            </ListItemIcon>
            <ListItemText primary={item.title} />
            {openCategories[item.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </ListItemButton>
          <Collapse in={openCategories[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.links.map((subItem) => (
                <ListItemButton
                  key={subItem.path}
                  sx={{ pl: 4 }}
                  selected={location.pathname === subItem.path}
                  onClick={() => navigate(subItem.path)}
                >
                  <ListItemText primary={subItem.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          selected={isSelected}
          onClick={() => navigate(item.path)}
        >
          <ListItemIcon>
            <Icon size={24} />
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <img
          src="/govlynk-logo.png"
          alt="GovLynk Logo"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
      <List sx={{ pt: 0 }}>
        {menuLinks.map(renderMenuItem)}
      </List>
    </Drawer>
  );
}