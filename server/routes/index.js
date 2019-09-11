const express = require("express");
const router = express.Router();
const axios = require("axios");

const TRELLO_API_ROOT = "https://api.trello.com/1";
router.get("/", function(req, res, next) {
  axios
    .get(
      `${TRELLO_API_ROOT}/boards/${process.env.BOARD_ID}?key=${process.env
        .TRELLO_KEY}&token=${process.env
        .TRELLO_TOKEN}&lists=all&cards=all&checklists=all`
    )
    .then(trelloRes => {
      res.json(trelloRes.data);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/card/:card_id/cover/:attachment_id", function(req, res, next) {
  axios
    .get(
      `${TRELLO_API_ROOT}/cards/${req.params.card_id}/attachments/${req.params
        .attachment_id}?key=${process.env.TRELLO_KEY}&token=${process.env
        .TRELLO_TOKEN}&lists=all&cards=all&checklists=all`
    )
    .then(trelloRes => {
      res.json(trelloRes.data);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/card/:card_id/checklist-item/:checklist_item_id", function(
  req,
  res,
  next
) {
  axios
    .put(
      `${TRELLO_API_ROOT}/cards/${req.params.card_id}/checkItem/${req.params
        .checklist_item_id}?key=${process.env.TRELLO_KEY}&token=${process.env
        .TRELLO_TOKEN}&state=${req.body.state}`
    )
    .then(trelloRes => {
      res.json(trelloRes.data);
    })
    .catch(err => {
      res.json(err);
    });
});
module.exports = router;
