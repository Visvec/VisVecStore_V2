import { Button, Divider, Fade, ListItemIcon, ListItemText, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { User } from "../models/user";
import { History, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router-dom";

type Props = {
    user: User;
};

export default function UserMenu({ user }: Props) {
    const [logout] = useLogoutMutation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <div>
            <Button
                onClick={handleClick}
                color="inherit"
                size={isMobile ? "medium" : "large"}
                sx={{
                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                }}
            >
                {user.email}
            </Button>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        minWidth: 200,
                        width: isMobile ? '100%' : 'auto',
                        maxWidth: '100vw',
                    }
                }}
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
            >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My profile</ListItemText>
                </MenuItem>

                <MenuItem component={Link} to="/orders" onClick={handleClose}>
                    <ListItemIcon>
                        <History fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My orders</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}
