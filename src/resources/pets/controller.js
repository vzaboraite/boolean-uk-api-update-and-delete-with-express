const db = require("../../utils/database");

function createOne(req, res) {
  const createOne = `
    INSERT INTO pets
      (name, age, type, microchip)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `;

  db.query(createOne, Object.values(req.body))
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function getAll(req, res) {
  const getAll = `
    SELECT *
    FROM pets;
  `;

  db.query(getAll)
    .then((result) => res.json({ data: result.rows }))
    .catch(console.error);
}

function getOneById(req, res) {
  const idToGet = req.params.id;

  const getOneById = `
    SELECT *
    FROM pets
    WHERE id = $1;
  `;

  db.query(getOneById, [idToGet])
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

const updateOneById = async (req, res) => {
  const petToUpdate = {
    id: req.params.id,
    ...req.body,
  };

  const updateByOneSQL = `
  UPDATE pets 
  SET name = $1,
  age = $2,
  type = $3,
  breed = $4,
  microchip = $5
  WHERE id = $6
  RETURNING *
  `;
  const { name, age, type, breed, microchip, id } = petToUpdate;

  try {
    const result = await db.query(updateByOneSQL, [
      name,
      age,
      type,
      breed,
      microchip,
      id,
    ]);

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
