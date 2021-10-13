const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateOneByName,
  patchUpdateOneById,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.put("/byName/:name", updateOneByName);

router.put("/:id", updateOneById);

router.patch("/:id", patchUpdateOneById);

module.exports = router;
