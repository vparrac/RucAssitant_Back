const opcion = document.querySelector("#botiquin");
const tableBody = document.querySelector("#botiquinData");

opcion.addEventListener("change", () => {
  const botiquinId = opcion.value;
  fetch("/botiquin/obtenerUsos/" + botiquinId)
    .then(res => res.json())
    .then(mostrarUsos);
});

const mostrarUsos = usos => {
    tableBody.innerHTML = "";
  usos.forEach(uso => {
    tableBody.innerHTML +=
      "<tr> <td>" +
      uso.gasas +
      "</td> <td>" +
      uso.esparadrapo4Metros +
      "</td> <td>" +
      uso.bajaLenguas +
      "</td> <td>" +
      uso.guantesLatex +
      "</td> <td>" +
      uso.vendaEl2x5 +
      "</td> <td>" +
      uso.vendaEl3x5 +
      "</td> <td>" +
      uso.vendaEl5x5 +
      "</td> <td>" +
      uso.vendaAl3x5 +
      "</td> <td>" +
      uso.yodopovidona120 +
      "</td> <td>" +
      uso.solucionSal +
      "</td> <td>" +
      uso.termometro +
      "</td> <td>" +
      uso.alcohol +
      "</td>" +
      "</tr>";
  });
};
