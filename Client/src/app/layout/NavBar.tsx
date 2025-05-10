import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, LinearProgress, List, ListItem, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchCartQuery } from "../../features/cart/cartApi";
import UserMenu from "./UserMenu";
import { useUserInfoQuery } from "../../features/account/accountApi";
import VisVec_Logo from '../../LOGO/VisVec_Logo.png'; // adjust path as needed

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
]
const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
]
const navStyles = {

  color: 'inherit',
  typography: 'h6',
  textDecoration: 'none',
  '&:hover': {
    color: 'grey.500'
  },
  '&.active': {
    color: '#baecf9'
  }

}

export default function NavBar() {
  const { data: user } = useUserInfoQuery();
  const { isLoading, darkMode } = useAppSelector(state => state.ui);
  const dispatch = useAppDispatch();
  const { data: cart } = useFetchCartQuery();

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ disply: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' alignItems='center'>

            <Box display="flex" alignItems="center" gap={1}>
  <Box
    component="img"
    src={VisVec_Logo}
    alt="Logo"
    style={{ width: '40px', height: '40px', marginTop: '2px' }}
  />
  <Typography
    component={NavLink}
    sx={navStyles}
    to="/"
    variant="h6"
  >
    VISVEC Store
  </Typography>
</Box>
          <IconButton onClick={() => dispatch(setDarkMode())}>
            {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
          </IconButton>
        </Box>

        <List sx={{ display: 'flex' }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyles}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        <Box display='flex' alignItems='center'>
          <IconButton component={Link} to='/cart' size="large" sx={{ color: 'inherit' }}>
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>

          </IconButton>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}

        </Box>

      </Toolbar>

      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  )
}