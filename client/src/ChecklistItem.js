import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Icon,
  Fab,
  Checkbox,
  ListItemIcon,
  CircularProgress
} from "@material-ui/core";

import LocalGroceryStore from "@material-ui/icons/LocalGroceryStore";

const API_ROOT = "http://localhost:5000";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  fab: {
    margin: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(2),
    height: 52,
    width: 52
  },
  inline: {
    display: "inline"
  }
}));

const ChecklistItem = item => {
  const classes = useStyles();
  const checklistItem = item.item;
  const [hasError, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [checked, setChecked] = useState(checklistItem.state === "complete");

  const handleToggle = () => {
    axios
      .post(
        `${API_ROOT}/card/${checklistItem.card
          .id}/checklist-item/${checklistItem.id}`,
        { state: checked ? "incomplete" : "complete" }
      )
      .then(function(response) {
        setChecked(!checked);
      })
      .catch(function(error) {
        setErrors(error);
      });
  };

  useEffect(
    () => {
      async function fetchImages() {
        if (!checklistItem.card.idAttachmentCover) {
          setLoading(false);
          return null;
        }
        await axios
          .get(
            `${API_ROOT}/card/${checklistItem.card.id}/cover/${checklistItem
              .card.idAttachmentCover}`
          )
          .then(res => {
            setImage(res.data.previews[6].url);
            setLoading(false);
          })
          .catch(err => {
            setImage(null);
            setErrors(err);
            setLoading(false);
          });
      }
      fetchImages();
    },
    [checklistItem]
  );

  if (hasError) {
    return <span>{hasError}</span>;
  }

  return (
    <div>
      <ListItem alignItems="center" dense button onClick={handleToggle}>
        <ListItemAvatar>
          {loading
            ? <CircularProgress className={classes.progress} />
            : <React.Fragment>
                {image
                  ? <Avatar className={classes.avatar} src={image} />
                  : <Fab color="primary" className={classes.fab}>
                      <Icon><LocalGroceryStore /></Icon>
                    </Fab>}
              </React.Fragment>}
        </ListItemAvatar>
        <ListItemText
          primary={checklistItem.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {checklistItem.card.name}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple={true}
          />
        </ListItemIcon>

      </ListItem>
      <Divider variant="inset" component="li" />
    </div>
  );
};

export default ChecklistItem;
