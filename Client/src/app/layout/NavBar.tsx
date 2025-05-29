import { useState } from "react";
import {
  DarkMode,
  LightMode,
  ShoppingCart,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Toolbar,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchCartQuery } from "../../features/cart/cartApi";
import UserMenu from "./UserMenu";
import { useUserInfoQuery } from "../../features/account/accountApi";
import VisVec_Logo from "../../LOGO/VisVec_Logo.png";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];
const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];
const navStyles = {
  color: "inherit",
  typography: "h6",
  textDecoration: "none",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "#baecf9",
  },
};

export default function NavBar() {
  const { data: user } = useUserInfoQuery();
  const { isLoading, darkMode } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { data: cart } = useFetchCartQuery();

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {midLinks.map(({ title, path }) => (
          <ListItem
            key={path}
            component={NavLink}
            to={path}
            sx={{ ...navStyles, display: "block", padding: "8px 16px" }}
          >
            {title.toUpperCase()}
          </ListItem>
        ))}
      </List>

      {user ? (
        <UserMenu user={user} />
      ) : (
        <List>
          {rightLinks.map(({ title, path }) => (
            <ListItem
              key={path}
              component={NavLink}
              to={path}
              sx={{ ...navStyles, display: "block", padding: "8px 16px" }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component="img"
              src={VisVec_Logo}
              alt="Logo"
              sx={{ width: 40, height: 40, mt: "2px" }}
            />
            <Typography
              component={NavLink}
              to="/"
              variant="h6"
              sx={navStyles}
              noWrap
            >
              VISVEC Store
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              <List sx={{ display: "flex", gap: 2 }}>
                {midLinks.map(({ title, path }) => (
                  <ListItem
                    key={path}
                    component={NavLink}
                    to={path}
                    sx={navStyles}
                  >
                    {title.toUpperCase()}
                  </ListItem>
                ))}
              </List>

              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => dispatch(setDarkMode())} color="inherit">
                  {darkMode ? <DarkMode /> : <LightMode sx={{ color: "yellow" }} />}
                </IconButton>

                <IconButton
                  component={Link}
                  to="/cart"
                  size="large"
                  sx={{ color: "inherit" }}
                >
                  <Badge badgeContent={itemCount} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <List sx={{ display: "flex", gap: 2 }}>
                    {rightLinks.map(({ title, path }) => (
                      <ListItem
                        key={path}
                        component={NavLink}
                        to={path}
                        sx={navStyles}
                      >
                        {title.toUpperCase()}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={() => dispatch(setDarkMode())} color="inherit">
                {darkMode ? <DarkMode /> : <LightMode sx={{ color: "yellow" }} />}
              </IconButton>

              <IconButton
                component={Link}
                to="/cart"
                size="large"
                sx={{ color: "inherit" }}
              >
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
