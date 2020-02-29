const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt-nodejs");
const { collections } = require("./collections");
// Connection URL
const url = "mongodb://localhost:27017" || url;

let db;

// Database Name
const dbName = "rucAssistantDB";

// Create a new MongoClient

const init = () =>
  MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {
    db = client.db(dbName);
  });

const insertOneDoc = (doc, dbCollection) => {
  const collection = db.collection(dbCollection);
  return collection.insertOne(doc);
};

const insertManyDocs = (docs, dbCollection) => {
  const collection = db.collection(dbCollection);
  return collection.insertMany(docs);
};

const getDocs = dbCollection => {
  const collection = db.collection(dbCollection);
  return collection.find({}).toArray();
};

const getDocById = (id, dbCollection) => {
  const collection = db.collection(dbCollection);
  return collection
    .find({
      _id: ObjectId(id),
    })
    .toArray();
};

const updateDoc = (id, object, dbCollection) => {
  const collection = db.collection(dbCollection);
  return collection.replaceOne(
    {
      _id: ObjectId(id),
    },
    object,
  );
};

const getWithJoin = (
  dbcollection,
  fromCollection,
  localField,
  foreingField,
  asName,
) => {
  const collection = db.collection(dbcollection);
  return collection
    .aggregate([
      { $unwind: "$" + localField },
      {
        $lookup: {
          from: fromCollection,
          localField: localField,
          foreignField: foreingField,
          as: asName,
        },
      },
      { $unwind: "$" + asName },
      {
        $group: {
          _id: "$_id",
          revisiones_id: { $push: "$" + localField },
          revisiones: { $push: "$" + asName },
        },
      },
    ])
    .toArray();
};

const pushRevision = (id, revisionId) => {
  const collection = db.collection("botiquin");
  return collection.update(
    { _id: ObjectId(id) },
    { $push: { revision_id: revisionId } },
    { upsert: true },
  );
};

/**
 * Método que permite cifrar la contraseña
 * Este método utiliza la librería bcrypt y ejecuta el algoritmo de encriptado 10 veces
 * @param {*} password
 */
const encryptPassword = password =>
  bcrypt.hashSync(password, bcrypt.genSalt(10));

const getLogin = login => {
  const collection = db.collection(collections.login);
  return collection.find({ login: login });
};

const comparePassword = (login, password) =>
  bcrypt.compareSync(password, getLogin(login));


module.exports = {
  init,
  insertOneDoc,
  insertManyDocs,
  getDocs,
  getDocById,
  updateDoc,
  getWithJoin,
  pushRevision,
  encryptPassword,
  comparePassword,
};
