const express = require("express");
const router = express.Router();
const { insertOneDoc, pushRevision, getDocById, updateDoc, getRevisionesByGerente } = require("../db");
const { ObjectId } = require("mongodb");

router.post("/crearRevision", async (req, res) => {
  //console.log(req.body);
  const user = await req.user;

  const object = await req.body;

  const botiquin = await getDocById(object.botiquin, "botiquin");  
  const revisionPendiente = {
    ...req.body,
    idGerente: user[0]._id,
    idUsuario: ObjectId(object.empleado),
    estado: "pendiente",
    nombreBotiquin: botiquin[0].nombre,
  };

  const revision = await insertOneDoc(revisionPendiente, "revision");
  pushRevision(object.botiquin, revision.ops[0]._id);
  res.redirect("/botiquin");
});

//router.get("/listarRevisiones", (req,res)=>{} )

router.post("/listRevisiones", async (req,res)=>{  
  const idUsuario = await req.user; 
  
  
  const revisiones = await getRevisionesByGerente(idUsuario._id);
  
  res.render("listaRevisiones",{ revisiones:revisiones });
});


 
router.post("/realizarRevision", async (req, res) => {
  const recibirRevisionId = await req.body;
  
  res.render("revisionBotiquin", { id: recibirRevisionId._id });
});


router.post("/terminarRevision", async (req, res) => {
  const object = await req.body;
  const revisionOriginal = await getDocById(object.idRevision,"revision");
  const no={
    calidadManual:object.calidadManual,
    comentario:object.comentario,
    timestamp: Date.now(),
    mes:revisionOriginal[0].mes,
    nombreBotiquin: revisionOriginal[0].nombreBotiquin,
    estado:"completado",
    empleado: revisionOriginal[0].idUsuario,
    botiquin: revisionOriginal[0].botiquin,
    idGerente: revisionOriginal[0].idGerente,
    cantidadGasas:object.cantidadGasas,
    estadoGasas:object.estadoGasas,
    esparadrapoCantidad:object.esparadrapoCantidad,
    estadoEsparadrapo:object.estadoEsparadrapo,
    bajaLenguasCantidad:object.bajaLenguasCantidad,
    estadoBajaLenguas:object.estadoBajaLenguas,
    guantesLatexCantidad:object.guantesLatexCantidad,
    estadoGuantesLatex:object.estadoGuantesLatex,
    venda2x5Cantidad:object.venda2x5Cantidad,
    venda2x5Calidad:object.venda2x5Calidad,
    venda3x5Cantidad:object.venda3x5Cantidad,
    venda3x5Calidad:object.venda3x5Calidad,
    venda5x5Cantidad:object.venda5x5Cantidad,
    yodopovidonaCantidad:object.yodopovidonaCantidad,
    yodopovidonaCalidad:object.yodopovidonaCalidad,
    sslCantidad:object.sslCantidad,
    sslCalidad:object.sslCalidad,
    termometroCantidad:object.termometroCantidad,
    termometroCalidad:object.termometroCalidad,
    alcoholCantidad:object.alcoholCantidad,
    alcoholCalidad:object.alcoholCalidad
  };
  await updateDoc(object.idRevision,no,"revision");
  res.redirect("/botiquin/revisionesPendientes");
});


module.exports = router;
