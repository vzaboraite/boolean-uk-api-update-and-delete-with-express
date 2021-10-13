const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateOneByTitle,
  updateOneByTitleWithQuery,
  deleteOneById,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.put("/", updateOneByTitleWithQuery);

router.put("/byTitle/:title", updateOneByTitle);

router.put("/:id", updateOneById);

router.delete("/:id", deleteOneById);

module.exports = router;
