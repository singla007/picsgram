import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { AUTH_TOKEN } from './util/constants';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Label } from '@mui/icons-material';

const LOGIN_MUTATION = gql`
    mutation LoginMutation(
        $email: String!
        $password: String!
    ) {
        login(email: $email, password: $password) {
            token
            user{
              name,
              id
              
            }
            
        }
    }
`;

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        PicsGram
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {

  const authToken = localStorage.getItem(AUTH_TOKEN);
  const navigate = useNavigate();
  const [error,setError] = React.useState({email:{error:false,helperText:""},password:{error:false,helperText:""}});
  const [buttonStatus,setButtonStatus] = React.useState(true);
  const [loginStatus,setLoginStatus] = React.useState(false);
  const [formState, setFormState] = React.useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    setButtonStatus(false);
    setFormState({
      ...formState,
      email: data.get('email'),
      password: data.get('password')
    })
    try {login();}
    catch(e){
      console.log(e)
    }
    if( ! (authToken)) {
      setLoginStatus(true)
    }
  };
  const emailHandler = (event) => {
    const email = event.currentTarget.value;
    const re =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (email && re.test(email)) {
      setError({ ...error, email:{
        error:false,
        helperText:""
      } });
      if(formState.email.length !== 0 && formState.password.length !== 0 || !error.password.error ){
        setButtonStatus(false)
      }
    }
    else {
      setError({ ...error, email:{
        error:true,
        helperText:"Invalid email"
      } });
      setButtonStatus(true);
    }

  };

  const passwordHandler = (event) => {
    const password = event.currentTarget.value;
    const re = 
      /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{8,30})$/i;
    if (password && re.test(password)) {
      setError({ ...error, password:{
        error:false,
        helperText:""
      } });
      if(formState.email.length !== 0 && formState.password.length !== 0 || !error.email.error ){
        setButtonStatus(false)
      }
    }
    else {
      setError({ ...error, password:{
        error:true,
        helperText:"Password should contain least one lowercase, one upper case, one number and the special charecters of (!,@,#,$,%,?,=,*,&) and at least 8 character long and not exceed 30 charceters"
      } });
      setButtonStatus(true);
    }

  };
  

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ login }) => {
      sessionStorage.setItem("userName",login.user.name);
      sessionStorage.setItem("userId",login.user.id)
      localStorage.setItem(AUTH_TOKEN, login.token);
      navigate('/Dashboard');
    }
  });
  React.useEffect(()=>{
    if(authToken){
      navigate('/Dashboard')
    }
    else navigate('/SignIn')
  },[authToken])
  
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
      
        <Box
          sx={{
            boxSizing:'none',
            marginTop: 8,
            margin:"20px 20px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In for Picsgram
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{boxSizing:'none', mt: 1 }}>
            <Typography>Email:</Typography> 
            <TextField
             
              required
              error ={error.email.error}
              fullWidth
              helperText={error.email.helperText}
              id="email"
              onChange={emailHandler}
              placeholder="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <div></div>
            <p></p>
            <Typography>Password:</Typography> 
            <TextField
            
              required
              error = {error.password.error}
              fullWidth
              helperText = {error.password.helperText}
              name="password"
              placeholder="Password"
              onChange={passwordHandler}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              disabled={buttonStatus}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Stack sx={{ width: '100%' }} spacing={2}>
              {loginStatus? <Alert severity="error">Error: User Email or password is incorrect!</Alert>
              :null}
            </Stack>

            <Grid container>
              <Grid item xs>
              <Typography variant="body2" align="center">{'what other are '}
                <Link href="/new" variant="body2">
                doing!
                </Link>
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body2" align="center">{'Not a member yet ? '}
                <Link href='/SignUp' variant="body2">
                  {"Sign Up"}
                </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}