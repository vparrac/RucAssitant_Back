const { MongoClient, ObjectId } = require("mongodb");

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


const deleteEmpleado = objeto =>{
  //console.log(objeto);
  const collection = db.collection("empleados");
  return collection.remove(objeto);
};
const getDocById = (id, dbCollection) => {
  const collection = db.collection(dbCollection);
  return collection
    .find({
      _id: ObjectId(id),
    })
    .toArray();
};


const getBotiquinesByGerente = (idGerente)=>{
  const collection= db.collection("botiquin");
  return collection.find({idgerente: ObjectId(idGerente)}).toArray();
};

const insertEmpleadoOfGerente = (object)=>{
  const collection= db.collection("empleados");
  return collection.insertOne(object);
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
  id,
) => {
  const collection = db.collection(dbcollection);
  return collection
    .aggregate([
      { $match: { _id: ObjectId(id) } },
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
  return collection.updateOne(
    { _id: ObjectId(id) },
    { $push: { revision_id: revisionId } },
    { upsert: true },
  );
};

const getLoginByName = (login) => {
  const collection = db.collection("login");
  return collection
    .find({
      email: login
    })
    .toArray();
};

const getLoginByEmail = (login) => {
  const collection = db.collection("empleados");
  return collection
    .find({
      email: login
    })
    .toArray();
};


const getEmpleadoOfGerente=(idGerente)=>{
  const collection = db.collection("empleados");
  return collection
    .find({
      idgerente: ObjectId(idGerente)
    })
    .toArray();

};
const getGerenteByEmail = (login) => {
  const collection = db.collection("gerentes");
  return collection
    .find({
      email: login
    })
    .toArray();
};


const findRevisionesByEmpleado= (empleado) =>{
  const collection = db.collection("revision");  
  return collection.find({estado:"pendiente",idUsuario: ObjectId(empleado)}).toArray();
};

const getEmpleadoByEmail = (login) => {
  const collection = db.collection("empleados");
  return collection
    .find({
      correo: login
    })
    .toArray();
};
const pushEmpleado = (id, empleadoId) => {
  const collection = db.collection("gerentes");
  return collection.update(
    { _id: ObjectId(id) },
    { $push: { empleados: empleadoId } },
    { upsert: true },
  );
};

module.exports = {
  init,
  insertOneDoc,
  insertManyDocs,
  getDocs,
  getDocById,
  updateDoc,
  getWithJoin,
  pushRevision,
  getLoginByName,
  getLoginByEmail,
  pushEmpleado,
  getGerenteByEmail,
  getEmpleadoByEmail,
  getBotiquinesByGerente,
  insertEmpleadoOfGerente,
  getEmpleadoOfGerente,
  deleteEmpleado,
  findRevisionesByEmpleado
};
