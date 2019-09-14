import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core";

import axios from "axios";

import ChecklistItem from "./ChecklistItem";

const API_ROOT = "http://localhost:5000";
const THIS_WEEK_LIST_ID = "5d6bc4632fd193652d33f9b7";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

const ChecklistByIngredient = () => {
  const [hasError, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState({});
  const classes = useStyles();

  async function fetchData() {
    await axios
      .get(API_ROOT)
      .then(res => {
        const cards = res.data.cards.filter(card => {
          return card.idList === THIS_WEEK_LIST_ID;
        });

        const checklists = res.data.checklists.filter(checklist => {
          return cards.find(card => {
            return checklist.idCard === card.id;
          });
        });

        let combinedChecklistItems = [];
        checklists.forEach(checklist => {
          combinedChecklistItems.push(
            checklist.checkItems.map(checkItem => ({
              ...checkItem,
              card: cards.find(card => {
                return card.id === checklist.idCard;
              })
            }))
          );
        });

        setChecklistItems(
          combinedChecklistItems
            .flat()
            .sort((a, b) => (a.name > b.name ? 1 : -1))
        );
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setErrors(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (hasError) {
    return <span>{hasError}</span>;
  }

  if (loading) {
    return <span>Loading</span>;
  }

  return (
    <List className={classes.root}>
      {checklistItems.map(checklistItem =>
        <ChecklistItem key={checklistItem.id} item={checklistItem} />
      )}
    </List>
  );
};
export default ChecklistByIngredient;
