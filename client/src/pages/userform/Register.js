import React from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
// import MenuItem from '@material-ui/core/MenuItem';
import { useStyles } from './loginStyles';

export default function Register({ values, handleChange, handleSubmit }) {
    const classes = useStyles();

    return (
        <div className={classes.paper}>
          <Grid container className={classes.createAccount}>
            <Grid className={classes.accountText}>Already have an account?</Grid>
            <Link to='/login'>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.switch}
                >
                  Login
                </Button>
            </Link>
          </Grid>
          <Grid container className={classes.mainContent}>
            <Grid container alignItems="left">
              <Typography component="h1" variant="h5">
                Create an account
              </Typography>
            </Grid>
            <form className={classes.form} onSubmit={ (event) => handleSubmit(event) }>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus
                value={ values.email }
                onChange={ handleChange }
                InputLabelProps={{
                  classes: {
                    root: classes.label,
                    focused: classes.focusedLabel,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.underline,
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={ values.password }
                onChange={ handleChange }
                InputLabelProps={{
                  classes: {
                    root: classes.label,
                    focused: classes.focusedLabel,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.underline,
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={ values.confirmPassword }
                onChange={ handleChange }
                InputLabelProps={{
                  classes: {
                    root: classes.label,
                    focused: classes.focusedLabel,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.underline,
                  },
                }}
              />
              <FormControl required margin='normal' className={classes.formControl}>
                <InputLabel className={classes.label}>Age</InputLabel>
                <NativeSelect value={ values.language } onChange={ handleChange } name='language'>
                  <option value="" />
                  <option value='English'>English</option>
                  <option value='French'>French</option>
                </NativeSelect>
              </FormControl>
              <Grid container className={classes.alignCenter}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              </Grid>
            </form>
          </Grid>
        </div>
    );
}