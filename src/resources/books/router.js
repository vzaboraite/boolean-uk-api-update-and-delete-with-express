const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateOneByTitle,
  updateOneByTitleWithQuery,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

// /books?filterByTitle=lorem-ipsum
router.put("/", updateOneByTitleWithQuery);

router.put("/byTitle/:title", updateOneByTitle);

router.put("/:id", updateOneById);

module.exports = router;
