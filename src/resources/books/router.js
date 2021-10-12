const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateOneByTitle,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.put("/byTitle/:title", updateOneByTitle);

router.put("/:id", updateOneById);

module.exports = router;
