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

const patchUpdateOneById = async (req, res) => {
  const { id } = req.params;
  const bookToUpdate = {
    ...req.body,
  };

  let patchUpdateOneByIdSQL = `
  UPDATE books
  SET `;

  let sqlParams = [];

  let i = 1;
  for (const prop in bookToUpdate) {
    patchUpdateOneByIdSQL += ` ${prop} = $${i++},`;
    sqlParams.push(bookToUpdate[prop]);
  }

  patchUpdateOneByIdSQL = patchUpdateOneByIdSQL.slice(
    0,
    patchUpdateOneByIdSQL.length - 1
  );

  patchUpdateOneByIdSQL += `\nWHERE id = $${i}`;
  patchUpdateOneByIdSQL += `\nRETURNING *`;

  sqlParams.push(id);

  try {
    const result = await db.query(patchUpdateOneByIdSQL, sqlParams);

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error({ error: error.message });

    res.status(500).json({ error: error.message });
  }
};

const deleteOneById = async (req, res) => {
  const { id } = req.params;

  const deleteOneByIdSQL = `
  DELETE FROM books
  WHERE id = $1
  `;

  try {
    const result = await db.query(deleteOneByIdSQL, [id]);

    res.json({ message: `Book with id:${id} deleted successfully!` });
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
  patchUpdateOneById,
  deleteOneById,
};
