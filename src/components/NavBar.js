import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN,APP_NAME } from './util/constants';

const pages = ['New Feed', 'Top Feed', 'Create','Search'];
const settings = ['Profile', 'Account', 'Logout'];



export default function NavBar() {
    const [searchData, setSearchData] = React.useState('');
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let navigate = useNavigate();

    const userName = ()=>{
        let tempName = sessionStorage.getItem("userName") || "Unkown";
        let words = tempName.split(" ");

       words=  words.map((word) => { 
            return word[0].toUpperCase() + word.substring(1); 
        }).join(" ");
        
        return words;
    }

    const logoutHandler = () => {
        localStorage.removeItem(AUTH_TOKEN);
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userId")
        navigate(`/`);
    }; 
    const handleNavbarItem = (event, page) => {

        if (page.toLowerCase() === "news feed") {
            navigate('/new')
        }
        else if (page.toLowerCase() === "create") {
            navigate('/create')
        }
        else if(page.toLowerCase() === "search"){
            navigate('/search')
        }
        else {
            navigate('/top')
        }
        handleCloseNavMenu();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" color="success"  style={{marginBottom:"10px"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {APP_NAME}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={(event) => handleNavbarItem(event, page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {APP_NAME}
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={(event) => handleNavbarItem(event, page)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    {authToken ?
                    <>
                    <Box sx={{ flexGrow: 0 }}>
                        <Typography>Hi, {userName()} &nbsp;&nbsp; </Typography>
                        
                        
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        
                        <Tooltip title="Logout from PicsGram">
                            <Button onClick={logoutHandler} variant="contained" color="error">
                                Log Out
                            </Button>
                        </Tooltip>
                        
                    </Box>
                    </>
                    :""}
                </Toolbar>
            </Container>
        </AppBar> );
}