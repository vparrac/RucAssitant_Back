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
