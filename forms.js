const formulario = document.getElementById("formulario");
const montoInput = document.getElementById("monto");
const riesgoInput = document.getElementById("riesgo");
const plazoInput = document.getElementById("plazo");
const containerResult = document.getElementById("containerResult");
const containerHistorial = document.getElementById("containerHistorial");
const resultado = document.getElementById("resultado");
const btnSimular = document.getElementById("btnSimular");
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const containerEnd = document.getElementById("containerEnd");
const btnHistorial = document.getElementById("btnHistorial");
const btnBorrarStorage = document.getElementById("btnBorrarStorage");
const monto = montoInput.value;
const riesgo = riesgoInput.value;
const plazo = plazoInput.value;
const urlOpcionesAhorro =
  "https://6487b7b6beba62972790ec6c.mockapi.io/simulaciones";

const opcionesAhorro = [
  //Para riesgo bajo existen 3 mecanismos de ahorro recomendados: Plazo fijo en unidades indexadas, Letras de regulacion monetaria y Ahorro en ganado
  //Por ese motivo los campos bonosDelTesoro y fondosDeInversion (que pertenecen a riesgo medio) estan vacios.
  //LAS OPCIONES DE AHORRO COMENTADAS SE ESTAN TOMANDO DE MOCKAPI
  /*{
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
  },*/
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
    //monto,
    riesgo,
    plazo,
    plazoFijo,
    letrasDeRegulacion,
    ahorroEnGanado,
    bonosDelTesoro,
    fondosDeInversion
  ) {
    //this.monto = monto;
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
        //elemento.monto,
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

formulario.classList.remove("disable");
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  simuladorAhorro();
});

//-----------------------------------------------------------------------------------
//Accedes a la info guardada en el localStorage
document.addEventListener("DOMContentLoaded", () => {
  let simulacionGuardada = localStorage.getItem("simulacion");
  if (simulacionGuardada !== null) {
    simulacionesAnteriores = [...JSON.parse(simulacionGuardada)];
  }
});

//-----------------------------------------------------------------------------------

//Simulacion Asincronica
//---------------------------------------------------
function simulacionAsincronica() {
  return new Promise((resolve, reject) => {
    // Simulando una operación asincrónica
    setTimeout(() => {
      if (montoInput.value !== "") {
        resolve();
      } else {
        reject(new Error());
      }
    }, 2001); // Simula un retardo de 2 segundos
  });
}
//---------------------------------------------------

function simuladorAhorro() {
  const monto = montoInput.value;
  const riesgo = riesgoInput.value;
  const plazo = plazoInput.value;

  //---------------------------------------------------
  let timerInterval;
  Swal.fire({
    title: "Simulacion en curso!",
    //html: "I will close in <b></b> milliseconds.",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      // const b = Swal.getHtmlContainer().querySelector("b");
      // timerInterval = setInterval(() => {
      //   b.textContent = Swal.getTimerLeft();
      // }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
  //---------------------------------------------------

  simulacionAsincronica()
    .then((res) => {
      Swal.fire({
        icon: "success",
        html: "Simulación exitosa!",
        confirmButtonColor: "#007bff",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Ups!",
        html: "El valor ingresado no es correcto, intentalo nuevamente.",
        confirmButtonColor: "#007bff",
      });
    });

  setTimeout(() => {
    if (monto !== "") {
      //Defincion de objeto para simulaciones anteriores
      const infoSimulaciones = {
        monto,
        riesgo,
        plazo,
      };

      //-----------------------------------------------------------------------------------
      //Pusheas el objeto infoSimulaciones al Array simulacionesAnteriores
      simulacionesAnteriores.push(infoSimulaciones);
      //console.log(simulacionesAnteriores);
      //Tranformas el objeto JS a formato JSON --> Y lo almacenas en el localStorage
      localStorage.setItem(
        "simulacion",
        JSON.stringify(simulacionesAnteriores)
      );

      //Se filtra opcionesAhorroArray en busca de aquellos elementos del mismo que contengan el riesgo y el plazo ingresado por el usuario
      let riesgoABuscar = opcionesAhorroArray.filter((elemento) => {
        return elemento.riesgo === riesgo;
      });
      let plazoABuscar = opcionesAhorroArray.filter((elemento) => {
        return elemento.plazo === plazo;
      });

      //Se obtiene el unico elemento que contiene ambos parametros ingresados por el usuario
      let elementoEnComun = opcionesAhorroArray.find((elemento) => {
        return (
          riesgoABuscar.includes(elemento) && plazoABuscar.includes(elemento)
        );
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
  }, 2000);
}

function cargarHistorial() {
  containerHistorial.innerHTML = "";
  simulacionesAnteriores.forEach((simulacion) => {
    containerHistorial.innerHTML += `<p>Monto: USD ${simulacion.monto} - Riesgo: ${simulacion.riesgo} - Plazo: ${simulacion.plazo} Meses</p>`;
    btnBorrarStorage.classList.remove("disable");
  });
}

//Traer opciones de ahorro de mockAPI
//---------------------------------------------------
function traerOpcionesAhorro() {
  fetch(urlOpcionesAhorro)
    .then((resp) => resp.json())
    .then((data) => {
      opcionesAhorroArray.push(...data);
    });
}
traerOpcionesAhorro();
//---------------------------------------------------

//BOTONES
//PANTALLA PRIMARIA
//---------------------------------------------------
btnSimular.addEventListener("click", () => {
  if (montoInput.value !== "") {
    btnSimular.classList.add("disable");
  }
});

btnHistorial.addEventListener("click", () => {
  cargarHistorial();
});

btnBorrarStorage.addEventListener("click", () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "¿Estas seguro que quieres borrar el historial?  ",
      html: "No será posible revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      width: "40%",
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          html: "El historial ha sido borrado exitosamente",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        localStorage.clear();
        simulacionesAnteriores = []; // Vaciar el array simulacionesAnteriores
        containerHistorial.innerHTML = ""; // Limpiar el contenido de containerHistorial
        btnBorrarStorage.classList.add("disable");
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          html: "Tu historial está a salvo :)",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    });
});
//---------------------------------------------------

//PANTALLA SECUNDARIA
//---------------------------------------------------
btnSi.addEventListener("click", () => {
  formulario.reset();
  containerResult.classList.add("disable");
  btnSimular.classList.remove("disable");
});

btnNo.addEventListener("click", () => {
  containerEnd.classList.remove("disable");
  containerResult.classList.add("disable");
  formulario.classList.add("disable");
});

//---------------------------------------------------
