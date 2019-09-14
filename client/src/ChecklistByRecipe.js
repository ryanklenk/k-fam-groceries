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

const compareItemName = (a, b) => {
  const itemA = a.item.name.toUpperCase();
  const itemB = b.item.name.toUpperCase();

  let comparison = 0;

  if (itemA < itemB) {
    comparison = 1;
  } else if (itemB < itemA) {
    comparison = -1;
  }

  return comparison;
};

const Checklist = () => {
  const [hasError, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState({});
  const [cards, setCards] = useState({});
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

        combinedChecklistItems = combinedChecklistItems.flat();
        setChecklistItems(combinedChecklistItems);
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
export default Checklist;
