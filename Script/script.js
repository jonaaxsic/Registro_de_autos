// Función para obtener vehículos desde localStorage con validación
function obtenerVehiculos() {
  try {
    return JSON.parse(localStorage.getItem('vehiculos')) || [];
  } catch (error) {
    console.error("Error al leer los datos de localStorage:", error);
    return [];
  }
}

// Función para guardar vehículos en localStorage
function guardarVehiculos(vehiculos) {
  localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
}

// Función para registrar un vehículo
function registrarVehiculo() {
  const patente = document.getElementById('patente').value.trim().toUpperCase();
  const marca = document.getElementById('marca').value.trim();
  const modelo = document.getElementById('modelo').value.trim();
  const anio = document.getElementById('anio').value.trim();
  const motor = document.getElementById('motor').value.trim();

  if (!validarDatosVehiculo(patente, marca, modelo, anio, motor)) return;

  const vehiculos = obtenerVehiculos();

  if (vehiculos.some(v => v.patente === patente)) {
    alert("Ya existe un vehículo con esa patente.");
    return;
  }

  vehiculos.push({ patente, marca, modelo, anio, motor });
  guardarVehiculos(vehiculos);
  alert("Vehículo registrado exitosamente.");
  limpiarCampos(['patente', 'marca', 'modelo', 'anio', 'motor']);
}

// Función para validar datos del vehículo
function validarDatosVehiculo(patente, marca, modelo, anio, motor) {
  if (!patente || !marca || !modelo || !anio || !motor) {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  if (!/^[A-Z0-9]{6,8}$/.test(patente)) {
    alert("La patente debe tener entre 6 y 8 caracteres alfanuméricos.");
    return false;
  }
  if (isNaN(anio) || anio < 1900 || anio > new Date().getFullYear()) {
    alert("El año debe ser un número válido.");
    return false;
  }
  return true;
}

// Función para limpiar campos del formulario
function limpiarCampos(ids) {
  ids.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.value = '';
  });
}

// Función para buscar un vehículo
function buscarVehiculo() {
  const termino = document.getElementById('buscarPatente').value.trim().toLowerCase();
  const resultadoDiv = document.getElementById('resultadoBusqueda');

  resultadoDiv.innerHTML = '';

  if (!termino) {
    resultadoDiv.innerHTML = '<p>Por favor, ingresa un término de búsqueda.</p>';
    return;
  }

  const vehiculos = obtenerVehiculos();
  const vehiculoEncontrado = vehiculos.find(v =>
    v.patente.toLowerCase() === termino ||
    v.marca.toLowerCase() === termino ||
    v.modelo.toLowerCase() === termino
  );

  if (vehiculoEncontrado) {
    resultadoDiv.innerHTML = `
      <p><strong>Patente:</strong> ${vehiculoEncontrado.patente}</p>
      <p><strong>Marca:</strong> ${vehiculoEncontrado.marca}</p>
      <p><strong>Modelo:</strong> ${vehiculoEncontrado.modelo}</p>
      <p><strong>Año:</strong> ${vehiculoEncontrado.anio}</p>
      <p><strong>N° Motor:</strong> ${vehiculoEncontrado.motor}</p>
    `;
    const botonDescargar = document.createElement('button');
    botonDescargar.className = 'btn btn-primary mt-3';
    botonDescargar.textContent = 'Descargar PDF';
    botonDescargar.onclick = () => descargarPDF(
      vehiculoEncontrado.patente,
      vehiculoEncontrado.marca,
      vehiculoEncontrado.modelo,
      vehiculoEncontrado.anio,
      vehiculoEncontrado.motor
    );
    resultadoDiv.appendChild(botonDescargar);
  } else {
    resultadoDiv.innerHTML = "<p>No se encontró ningún vehículo.</p>";
  }
}

// Función para descargar la información del vehículo en PDF
function descargarPDF(patente, marca, modelo, anio, motor) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Información del Vehículo", 10, 10);
  doc.setFontSize(12);
  doc.text(`Patente: ${patente}`, 10, 30);
  doc.text(`Marca: ${marca}`, 10, 40);
  doc.text(`Modelo: ${modelo}`, 10, 50);
  doc.text(`Año: ${anio}`, 10, 60);
  doc.text(`N° Motor: ${motor}`, 10, 70);

  doc.save(`Vehiculo_${patente}.pdf`);
}

// Función para salir del programa
function salirPrograma() {
  alert("Gracias por usar VehiculeSoft. Puedes cerrar esta ventana manualmente.");
}