const db = require("../../utils/database");

function createOne(req, res) {
  const createOne = `
    INSERT INTO books
      (name, type, author, topic, publicationDate)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  db.query(createOne, Object.values(req.body))
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function getAll(req, res) {
  const getAll = `
    SELECT *
    FROM books;
  `;

  db.query(getAll)
    .then((result) => res.json({ data: result.rows }))
    .catch(console.error);
}

function getOneById(req, res) {
  const idToGet = req.params.id;

  const getOneById = `
    SELECT *
    FROM books
    WHERE id = $1;
  `;

  db.query(getOneById, [idToGet])
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

const updateOneById = async (req, res) => {
  const bookToUpdate = {
    id: req.params.id,
    ...req.body,
  };

  const updateOneByIdSQL = `
  UPDATE books 
  SET title = $1,
  type = $2,
  author = $3,
  topic = $4,
  publicationDate = $5
  WHERE id = $6
  RETURNING *
  `;

  const { title, type, author, topic, publicationdate, id } = bookToUpdate;

  try {
    const result = await db.query(updateOneByIdSQL, [
      title,
      type,
      author,
      topic,
      publicationdate,
      id,
    ]);

    console.log({ result: result.rows[0] });

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error({ error: error.message });

    res.status(500).json({ error: error.message });
  }
};

const updateOneByTitle = async (req, res) => {
  const targetTitle = req.params.title;

  const bookToUpdate = {
    ...req.body,
  };

  const updateOneByTitleSQL = `
  UPDATE books
  SET title = $1,
  type = $2,
  author = $3,
  topic = $4,
  publicationDate = $5
  WHERE title = $6
  RETURNING *
  `;

  const { title, type, author, topic, publicationdate } = bookToUpdate;

  try {
    const result = await db.query(updateOneByTitleSQL, [
      title,
      type,
      author,
      topic,
      publicationdate,
      targetTitle,
    ]);

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error({ error: error.message });

    res.status(500).json({ error: error.message });
  }
};

const updateOneByTitleWithQuery = async (req, res) => {
  const { filterByTitle } = req.query;

  const targetTitle = filterByTitle;

  const bookToUpdate = {
    ...req.body,
  };

  const updateOneByTitleWithQuerySQL = `
  UPDATE books
  SET title = $1,
  type = $2,
  author = $3,
  topic = $4,
  publicationDate = $5
  WHERE title = $6
  RETURNING *
  `;

  const { title, type, author, topic, publicationdate } = bookToUpdate;

  try {
    const result = await db.query(updateOneByTitleWithQuerySQL, [
      title,
      type,
      author,
      topic,
      publicationdate,
      targetTitle,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error({ error: error.message });

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateOneByTitle,
  updateOneByTitleWithQuery,
};
