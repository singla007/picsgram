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
import { validateUserName, validateEmail, validatePassword } from './services/validators';

const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $email: String!
        $password: String!
        $name: String!
    ) {
        signup(
            email: $email
            password: $password
            name: $name
        ) {
            token
            user{
              name
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
        Instagram
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
  const [error, setError] = React.useState({ userName: { error: false, helperText: "" }, email: { error: false, helperText: "" }, password: { error: false, helperText: "" } });
  const [buttonStatus, setButtonStatus] = React.useState(true);
  const [loginStatus, setLoginStatus] = React.useState(false);
  const [formState, setFormState] = React.useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userform = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('userName')
    }

    if (validateEmail(userform.email) || validatePassword(userform.password) || validateUserName(userform.userName)) {
      signup()
    }
    else {
      setButtonStatus(true)
    }
    // const data = new FormData(event.currentTarget);
    // setFormState({
    //   ...formState,
    //   email: data.get('email'),
    //   password: data.get('password'),
    //   name: data.get('userName'),
    // })




    if (!(authToken)) {
      setLoginStatus(true)
    }
  }
  const emailHandler = (event) => {
    const email = event.currentTarget.value;
    if (validateEmail(email)) {
      setError({
        ...error, email: {
          error: false,
          helperText: ""
        }
      });
      setFormState({
        ...formState,
        email: email
      })
      if (!error.password.error && !error.userName.error) {
        setButtonStatus(false)
      }
    }
    else {
      setError({
        ...error, email: {
          error: true,
          helperText: "Invalid email"
        }
      });
      setButtonStatus(true);
    }

  };

  const passwordHandler = (event) => {
    const password = event.currentTarget.value;
    if (validatePassword(password)) {
      setError({
        ...error, password: {
          error: false,
          helperText: ""
        }
      });
      setFormState({
        ...formState,
        password: password
      })
      if (!error.email.error && !error.userName.error) {
        setButtonStatus(false)
      }
    }
    else {
      setError({
        ...error, password: {
          error: true,
          helperText: "Password should contain least one lowercase, one upper case, one number and the special charecters of (!,@,#,$,%,?,=,*,&) and at least 8 character long and not exceed 30 charceters"
        }
      });
      setButtonStatus(true);
    }

  };
  const userNameHandler = (event) => {
    const name = event.currentTarget.value;
    const re = /^(?=.*[a-zA-Z\-]).{4,}$/;
    if (validateUserName(name)) {
      setError({
        ...error, userName: {
          error: false,
          helperText: ""
        }
      });
      setFormState({
        ...formState,
        name: name
      })
      if (!error.password.error && !error.email.error) {
        setButtonStatus(false)
      }
    }
    else {
      setError({
        ...error, userName: {
          error: true,
          helperText: "Name should contain letters only and at least 4 charcter long"
        }
      });
      setButtonStatus(true);
    }

  }


  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      sessionStorage.setItem("userName", signup.user.name);
      sessionStorage.setItem("UserId", signup.user.id)
      navigate('/Dashboard');
    }
  });
  React.useEffect(() => {
    if (authToken) {
      navigate('/Dashboard')
    }
  }, [authToken])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up to see photos and posts from your friends.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              error={error.userName.error}
              fullWidth
              helperText={error.userName.helperText}
              name="userName"
              label="Full Name"
              onChange={userNameHandler}
              type="text"
              id="userName"
              autoComplete="name"
            />
            <TextField
              margin="normal"
              required
              error={error.email.error}
              fullWidth
              helperText={error.email.helperText}
              id="email"
              onChange={emailHandler}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              error={error.password.error}
              fullWidth
              helperText={error.password.helperText}
              name="password"
              label="Password"
              onChange={passwordHandler}
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Typography >By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
            </Typography>
            <Button
              type="submit"
              fullWidth
              disabled={buttonStatus}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Stack sx={{ width: '100%' }} spacing={2}>
              {loginStatus ? <Alert severity="warning">Warning: Cant not login after signup!</Alert>
                : null}
              {/* <Alert severity="warning">This is a warning alert — check it out!</Alert>
              <Alert severity="info">This is an info alert — check it out!</Alert>
              <Alert severity="success">This is a success alert — check it out!</Alert> */}
            </Stack>

            <Grid container>
              <Grid item xs>
                <Typography variant="body2" align="center">{'Want to see what other are doing? '}
                  <Link href="/new" variant="body2">
                    Here!
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" align="center">{'Already have an account? '}
                  <Link href='/SignIn' variant="body2">
                    {"Sign in"}
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