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

const updateOneByName = async (req, res) => {
  const targetName = req.params.name;

  const petToUpdate = {
    ...req.body,
  };

  const updateOneByNameSQL = `
  UPDATE pets
  SET name = $1,
  age = $2,
  type = $3,
  breed = $4,
  microchip = $5
  WHERE name = $6
  RETURNING *
  `;

  const { name, age, type, breed, microchip } = petToUpdate;

  try {
    const result = await db.query(updateOneByNameSQL, [
      name,
      age,
      type,
      breed,
      microchip,
      targetName,
    ]);

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error({ error: error.message });

    res.status(500).json({ error: error.message });
  }
};

const patchUpdateOneById = async (req, res) => {
  const { id } = req.params;
  const petToUpdate = {
    ...req.body,
  };

  let patchUpdateOneByIdSQL = `UPDATE pets 
  SET`;

  let sqlParams = [];

  let i = 1;
  for (const prop in petToUpdate) {
    patchUpdateOneByIdSQL += ` ${prop} = $${i++},`;
    sqlParams.push(petToUpdate[prop]);
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

    res.json({ data: result.rows });
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
  updateOneByName,
  patchUpdateOneById,
};
