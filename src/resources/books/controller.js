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

  // UPDATE books SET title='Updated Title' WHERE id=1 RETURNING *
  const updateOneByIdSQL = `
  UPDATE books 
  SET title = $1,
  author = $2
  WHERE id = $3 
  RETURNING *
  `;

  const { title, author, id } = bookToUpdate;

  try {
    const result = await db.query(updateOneByIdSQL, [title, author, id]);

    console.log({ result: result.rows[0] });

    res.json({ data: result.rows[0] });
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
};
