import React from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  ListItemIcon 
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Logout, AccountCircle, Preview } from "@mui/icons-material";
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import image from "../asset/dmsc-logo2.png";

const UserInfo = () => {
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("1zxcasgr0kergrgkwjeir");
    localStorage.removeItem("fullname");
    handleMenuClose();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "24px",
        right: "24px",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* User Profile Button */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          },
          transition: "box-shadow 0.3s ease",
        }}
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-controls="user-menu"
      >
        <Avatar
          src={image}
          alt="Logo"
          sx={{
            width: 36,
            height: 36,
            marginRight: 2,
          }}
        />

        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            ระบบจัดการข้อมูล
          </Typography>
          {fullname && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                display: "block",
              }}
            >
              {fullname}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: "12px",
            overflow: "hidden",
            py: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Section */}
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemIcon>
            <AccountCircle color="disabled" />
          </ListItemIcon>
          <Typography variant="body2" color="text.secondary">
          {fullname}
          </Typography>
        </MenuItem>

        {/* Action Buttons Section */}
        <Box sx={{ px: 1.5, py: 1 }}>
          <Button
            fullWidth
            component={Link}
            to="/preview-page"
            startIcon={<Preview />}
            variant="contained"
            sx={{
              textTransform: "none",
              mb: 1,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Preview / Export
          </Button>

          <Button
            fullWidth
            component={Link}
            to="/data-manage"
            startIcon={<AddchartTwoToneIcon />}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Data Manage
          </Button>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Logout Section */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <Typography variant="body2" color="error">
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserInfo;