const formulario = document.getElementById("formulario");
const montoInput = document.getElementById("monto");
const riesgoInput = document.getElementById("riesgo");
const plazoInput = document.getElementById("plazo");
const containerResult = document.getElementById("containerResult");
const resultado = document.getElementById("resultado");
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const containerEnd = document.getElementById("containerEnd");
const btnSimulacionesAnt = document.getElementById("btnSimulacionesAnt");
const btnBorrarStorage = document.getElementById("btnBorrarStorage");
const monto = montoInput.value;
const riesgo = riesgoInput.value;
const plazo = plazoInput.value;

const opcionesAhorro = [
  //Para riesgo bajo existen 3 mecanismos de ahorro recomendados: Plazo fijo en unidades indexadas, Letras de regulacion monetaria y Ahorro en ganado
  //Por ese motivo los campos bonosDelTesoro y fondosDeInversion (que pertenecen a riesgo medio) estan vacios.
  {
    riesgo: "Bajo",
    plazo: "12", //Plazo en meses
    plazoFijo: 10,
    letrasDeRegulacion: 25,
    ahorroEnGanado: 60, //Solo habilitado para montos mayores a USD5000
    bonosDelTesoro: "",
    fondosDeInversion: "",
  },
  {
    riesgo: "Bajo",
    plazo: "24", //Plazo en meses
    plazoFijo: 20,
    letrasDeRegulacion: 35,
    ahorroEnGanado: 70, //Solo habilitado para montos mayores a USD5000
    bonosDelTesoro: "",
    fondosDeInversion: "",
  },
  {
    riesgo: "Bajo",
    plazo: "36", //Plazo en meses
    plazoFijo: 30,
    letrasDeRegulacion: 65,
    ahorroEnGanado: 90, //Solo habilitado para montos mayores a USD5000
    bonosDelTesoro: "",
    fondosDeInversion: "",
  },
  //Para riesgo medio existen 2 mecanismos de ahorro recomendados: Bonos del tesoro y Fondos de inversion
  {
    riesgo: "Medio",
    plazo: "12", //Plazo en meses
    plazoFijo: "",
    letrasDeRegulacion: "",
    ahorroEnGanado: "",
    bonosDelTesoro: 50,
    fondosDeInversion: 65,
  },
  {
    riesgo: "Medio",
    plazo: "24", //Plazo en meses
    plazoFijo: "",
    letrasDeRegulacion: "",
    ahorroEnGanado: "",
    bonosDelTesoro: 100,
    fondosDeInversion: 105,
  },
  {
    riesgo: "Medio",
    plazo: "36", //Plazo en meses
    plazoFijo: "",
    letrasDeRegulacion: "",
    ahorroEnGanado: "",
    bonosDelTesoro: 110,
    fondosDeInversion: 115,
  },
];

let opcionesAhorroArray = [];

//Array de objetos para guardar simulaciones anteriores
let simulacionesAnteriores = [];

class OpcionAhorro {
  constructor(
    monto,
    riesgo,
    plazo,
    plazoFijo,
    letrasDeRegulacion,
    ahorroEnGanado,
    bonosDelTesoro,
    fondosDeInversion
  ) {
    this.monto = monto;
    this.riesgo = riesgo;
    this.plazo = plazo;
    this.plazoFijo = plazoFijo;
    this.letrasDeRegulacion = letrasDeRegulacion;
    this.ahorroEnGanado = ahorroEnGanado;
    this.bonosDelTesoro = bonosDelTesoro;
    this.fondosDeInversion = fondosDeInversion;
  }
}

function pushOpcionesAhorro() {
  for (const elemento of opcionesAhorro) {
    opcionesAhorroArray.push(
      new OpcionAhorro(
        elemento.monto,
        elemento.riesgo,
        elemento.plazo,
        elemento.plazoFijo,
        elemento.letrasDeRegulacion,
        elemento.ahorroEnGanado,
        elemento.bonosDelTesoro,
        elemento.fondosDeInversion
      )
    );
  }
}

pushOpcionesAhorro();

function calcular(monto, interes) {
  let resultado = Math.round((monto * interes) / 10000);
  return resultado;
}

//initProgram();

//function initProgram() {
formulario.classList.remove("disable");
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  simuladorAhorro();
});
//}

//-----------------------------------------------------------------------------------
//Accedes a la info guardada en el localStorage
document.addEventListener("DOMContentLoaded", () => {
  let simulacionGuardada = localStorage.getItem("simulacion");
  //console.log(simulacionGuardada);
  if (simulacionGuardada !== null) {
    //const simulacionAuxiliar = JSON.parse(simulacionGuardada);
    simulacionesAnteriores = [...JSON.parse(simulacionGuardada)];
    //Transformo el array de objetos en formato JSON a formato JS
    // simulacionAuxiliar.forEach((simulacion) => {
    //   simulacionesAnteriores.push(simulacion);
    // });
  }
});

//-----------------------------------------------------------------------------------

function simuladorAhorro() {
  const monto = montoInput.value;
  const riesgo = riesgoInput.value;
  const plazo = plazoInput.value;

  //Defincion de objeto para simulaciones anteriores
  const infoSimulaciones = {
    monto,
    riesgo,
    plazo,
  };

  //-----------------------------------------------------------------------------------
  //Pusheas el objeto infoSimulaciones al Array simulacionesAnteriores
  simulacionesAnteriores.push(infoSimulaciones);
  console.log(simulacionesAnteriores);
  //Tranformas el objeto JS a formato JSON --> Y lo almacenas en el localStorage
  localStorage.setItem("simulacion", JSON.stringify(simulacionesAnteriores));

  //Se filtra opcionesAhorroArray en busca de aquellos elementos del mismo que contengan el riesgo y el plazo ingresado por el usuario
  let riesgoABuscar = opcionesAhorroArray.filter((elemento) => {
    return elemento.riesgo === riesgo;
  });
  let plazoABuscar = opcionesAhorroArray.filter((elemento) => {
    return elemento.plazo === plazo;
  });

  //Se obtiene el unico elemento que contiene ambos parametros ingresados por el usuario
  let elementoEnComun = opcionesAhorroArray.find((elemento) => {
    return riesgoABuscar.includes(elemento) && plazoABuscar.includes(elemento);
  });

  //Obtenido el elemento se realizan los calculos de interes
  if (riesgo == "Bajo") {
    let interesPlazoFijo = elementoEnComun.plazoFijo;
    let interesLetras = elementoEnComun.letrasDeRegulacion;
    let resultadoFinal = calcular(monto, interesPlazoFijo);
    let resultadoFinal2 = calcular(monto, interesLetras);
    if (monto < 5000) {
      containerResult.classList.remove("disable"); //Se hace visible la pantalla secundaria que muestra las opciones de ahorro
      resultado.innerText = `Te recomendamos depositar tu capital en alguno de los siguientes instrumentos (Interes acumulado a los ${plazo} meses): \n\nPlazo fijo en Unidades Indexadas: USD ${resultadoFinal}\n\nLetras de regulacion monetaria. USD ${resultadoFinal2}\n\n`;
    } else {
      let interesEnGanado = elementoEnComun.ahorroEnGanado;
      let resultadoFinal3 = calcular(monto, interesEnGanado);
      containerResult.classList.remove("disable");
      resultado.innerText = `Te recomendamos depositar tu capital en alguno de los siguientes instrumentos (Interes acumulado a los ${plazo} meses): \n\nPlazo fijo en Unidades Indexadas: USD ${resultadoFinal}\n\nLetras de regulacion monetaria. USD ${resultadoFinal2} \n\n Ahorro en ganado: USD ${resultadoFinal3}\n\n`;
    }
  } else if (riesgo == "Medio") {
    let interesBonos = elementoEnComun.bonosDelTesoro;
    let interesFondos = elementoEnComun.fondosDeInversion;
    let resultadoFinal = calcular(monto, interesBonos);
    let resultadoFinal2 = calcular(monto, interesFondos);
    containerResult.classList.remove("disable");
    resultado.innerText = `Te recomendamos depositar tu capital en alguno de los siguientes instrumentos (Interes acumulado a los ${plazo} meses): \n\nBonos del Tesoro: USD ${resultadoFinal}\n\nFondos de Inversion. USD ${resultadoFinal2}\n\n`;
  }
}

//Pantalla secundaria

btnSi.addEventListener("click", () => {
  formulario.reset();
  containerResult.classList.add("disable");
});

btnNo.addEventListener("click", () => {
  containerEnd.classList.remove("disable");
  containerResult.classList.add("disable");
  formulario.classList.add("disable");
});

btnBorrarStorage.addEventListener("click", () => {
  localStorage.clear();
});
