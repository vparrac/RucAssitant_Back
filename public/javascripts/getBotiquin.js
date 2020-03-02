const mostrarDetalle = idBotiquin => {
  fetch("/botiquin/botiquin/" + idBotiquin)
    .then(res => res.json())
    .then(showBotiquin);
};

const showBotiquin = botiquin => {
  fetch("/botiquin/revisionesDeBotiquin/" + botiquin[0]._id)
    .then(res => res.json())
    .then(showRevisiones);
};

const showRevisiones = revisiones => {
  if (revisiones) {
    document.querySelector("#tableDetalle").style.display = "block";
    document.querySelector("#tableBotiquin").style.display = "none";
    const tableBody = document.querySelector("#revisionesBody");
    tableBody.innerHTML = "";
    const tableData = revisiones[0].revisiones;

    tableData.forEach(revision => {
      const date = moment.unix(revision.timestamp);
      tableBody.innerHTML +=
        "<tr> <td>" +
        date.format("DD/MM/YYYY") +
        "</td> <td>" +
        revision.estado +
        "</td> <td>" +
        revision.estadoManual +
        "</td> <td>" +
        revision.gasas.cantidad +
        "</td> <td>" +
        revision.gasas.estado +
        "</td> <td>" +
        revision.esparadrapo4Metros.cantidad +
        "</td> <td>" +
        revision.esparadrapo4Metros.estado +
        "</td> <td>" +
        revision.bajalenguas.cantidad +
        "</td> <td>" +
        revision.bajalenguas.estado +
        "</td> <td>" +
        revision.guantesLatex.cantidad +
        "</td> <td>" +
        revision.guantesLatex.estado +
        "</td> <td>" +
        revision.vendaEl2x5.cantidad +
        "</td> <td>" +
        revision.vendaEl2x5.estado +
        "</td> <td>" +
        revision.vendaEl3x5.cantidad +
        "</td> <td>" +
        revision.vendaEl3x5.estado +
        "</td> <td>" +
        revision.vendaEl5x5.cantidad +
        "</td> <td>" +
        revision.vendaEl5x5.estado +
        "</td> <td>" +
        revision.vendaAl3x5.cantidad +
        "</td> <td>" +
        revision.vendaAl3x5.estado +
        "</td> <td>" +
        revision.yodopovidona120.cantidad +
        "</td> <td>" +
        revision.yodopovidona120.estado +
        "</td> <td>" +
        revision.solucionSal.cantidad +
        "</td> <td>" +
        revision.solucionSal.estado +
        "</td> <td>" +
        revision.termometro.cantidad +
        "</td> <td>" +
        revision.termometro.estado +
        "</td> <td>" +
        revision.alcohol.cantidad +
        "</td> <td>" +
        revision.alcohol.estado +
        "</td>" +
        "</tr>";
    });
  }
};

const reabastecer = botiquinId => {
  fetch("/botiquin/botiquin/" + botiquinId)
    .then(res => res.json())
    .then(reabastecerBotiquin);
};

const reabastecerBotiquin = botiquin => {
  const reabastecido = {
    nombre: botiquin[0].nombre,
    gasas: "20",
    esparadrapo4Metros: "1",
    bajaLenguas: "20",
    guantesLatex: "100",
    vendaEl2x5: "1",
    vendaEl3x5: "1",
    vendaEl5x5: "1",
    vendaAl3x5: "2",
    yodopovidona120: "1",
    solucionSal: "2",
    termometro: "1",
    alcohol: "1",
  };
  fetch("/botiquin/editar/" + botiquin[0]._id, {
    method: "PUT",
    body: JSON.stringify(reabastecido),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(showTableData);
};

const showTableData = data => {
  if (data.nModified === 1) {
    fetch("/botiquin/dibujarBotiquin")
      .then(res => res.json())
      .then(drawData);
  }
};

const drawData = data => {
  const tableBody = document.querySelector("#botiquinData");
  tableBody.innerHTML = "";
  data.forEach(botiquin => {
    tableBody.innerHTML +=
      "<tr> <td>" +
      botiquin.nombre + 
      "</td> <td>" +
      botiquin.gasas +
      "</td> <td>" +
      botiquin.esparadrapo4Metros +
      "</td> <td>" +
      botiquin.bajaLenguas +
      "</td> <td>" +
      botiquin.guantesLatex +
      "</td> <td>" +
      botiquin.vendaEl2x5 +
      "</td> <td>" +
      botiquin.vendaEl3x5 +
      "</td> <td>" +
      botiquin.vendaEl5x5 +
      "</td> <td>" +
      botiquin.vendaAl3x5 +
      "</td> <td>" +
      botiquin.yodopovidona120 +
      "</td> <td>" +
      botiquin.solucionSal +
      "</td> <td>" +
      botiquin.termometro +
      "</td> <td>" +
      botiquin.alcohol +
      "</td> <td class='table-inline'>" +
      "<button id='detalle' class='btn btn-primary' onclick='mostrarDetalle(" + botiquin._id + ")'><i class='fa fa-search'></i></button>" + 
      "<button id='reabastecer' class='btn btn-primary' onclick='reabastecer(" + botiquin._id + ")'><i class='fa fa-refresh'></i></button>" +
      "</td> </tr>";
  });
  console.log(tableBody);
};
