import React from "react";
import { Box, Paper, Typography, Button, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Logout, AccountCircle, Preview } from "@mui/icons-material";
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
      {/* Preview Page Button */}
      <Button
        component={Link}
        to="/preview-page"
        startIcon={<Preview />}
        sx={{
          textTransform: "none",
          color: "white",
          backgroundColor: "primary.main",
          px: 2,
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        Preview / Export
      </Button>

      <Button
        component={Link}
        to="/data-manage"
        startIcon={<Preview />}
        sx={{
          textTransform: "none",
          color: "white",
          backgroundColor: "primary.main",
          px: 2,
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        Data Manage
      </Button>

      {/* User Profile */}
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
        }}
        onClick={handleMenuOpen}
      >
        {/* Logo */}
        <Avatar
          src={image}
          alt="Logo"
          sx={{
            width: 36,
            height: 36,
            marginRight: 2,
          }}
        />

        {/* User Info */}
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

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: "12px",
            overflow: "hidden",
            "& .MuiMenuItem-root": {
              fontSize: "0.875rem",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
            <AccountCircle sx={{ mr: 1.5, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              User Profile
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
            <Logout sx={{ mr: 1.5, color: "error.main" }} />
            <Typography variant="body2" color="error">
              Logout
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserInfo;