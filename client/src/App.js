import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, AppBar, Toolbar, Typography } from "@material-ui/core";

import ChecklistByIngredient from "./ChecklistByIngredient.js";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  container: {
    marginTop: 10
  }
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            k fam groceries <span role="img" aria-label="bread">🍞</span>
            <span role="img" aria-label="apple">🍎</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className={classes.container}>
        <ChecklistByIngredient />
      </Container>
    </div>
  );
}

export default App;
