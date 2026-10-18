let vehiculosGlobal = [];
let fotosVehiculoActual = [];
let indiceFotoActual = 0;

document.addEventListener("DOMContentLoaded", function () {
  cargarInventarioPublico();
  aplicarTextosConfig();
});

function cargarInventarioPublico() {
  const guardados = localStorage.getItem("inventario_crestmont");
  
  if (guardados) {
    vehiculosGlobal = JSON.parse(guardados);
  } else {
    vehiculosGlobal = [
      {
        id: 1,
        marca: "Toyota",
        modelo: "Hilux GR Sport",
        ano: 2024,
        precio: 54000,
        km: "5,000 km",
        motor: "2.8L Turbo Diesel",
        transmision: "Automática",
        descripcion: "Vehículo en estado impecable, rigurosa inspección superada.",
        imagenes: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"]
      },
      {
        id: 2,
        marca: "Ford",
        modelo: "Mustang GT Premium",
        ano: 2023,
        precio: 62000,
        km: "12,000 km",
        motor: "5.0L V8",
        transmision: "Automática",
        descripcion: "Exclusiva potencia americana y acabados de máxima categoría.",
        imagenes: ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80"]
      }
    ];
    localStorage.setItem("inventario_crestmont", JSON.stringify(vehiculosGlobal));
  }

  mostrarVehiculos(vehiculosGlobal);
}

function mostrarVehiculos(lista) {
  const contenedor = document.getElementById("catalogo-publico");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">No se encontraron vehículos disponibles.</p>`;
    return;
  }

  lista.forEach((car, index) => {
    const listaImgs = car.imagenes || car.fotos || [];
    let fotoPrincipal = listaImgs.length > 0 ? listaImgs[0] : "https://via.placeholder.com/400x250?text=Crestmont+Motors";
    let totalFotos = listaImgs.length;
    let tituloVehiculo = car.vehiculo || `${car.marca || ''} ${car.modelo || ''}`.trim();

    let card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-thumb-container" onclick="abrirModalGaleria(${index})">
        <img src="${fotoPrincipal}" alt="${tituloVehiculo}">
        <div class="photo-badge">📷 ${totalFotos}</div>
      </div>
      <div class="car-details">
        <div class="car-title">${tituloVehiculo} (${car.ano})</div>
        <div class="car-price">$${Number(car.precio).toLocaleString()}</div>
        <div class="car-info"><strong>Kilometraje:</strong> ${car.km || 'N/D'}</div>
        <div class="car-info"><strong>Motor:</strong> ${car.motor || 'N/D'}</div>
        <div class="car-info"><strong>Transmisión:</strong> ${car.transmision || 'N/D'}</div>
        <div class="car-desc">${car.descripcion || 'Sin descripción adicional.'}</div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function aplicarFiltros() {
  const texto = document.getElementById("filtro-texto").value.toLowerCase();
  const ano = document.getElementById("filtro-ano").value;
  const precioMax = parseFloat(document.getElementById("filtro-precio").value) || Infinity;

  const filtrados = vehiculosGlobal.filter(car => {
    const tituloBusqueda = car.vehiculo || `${car.marca || ''} ${car.modelo || ''}`;
    const textoMatch = `${tituloBusqueda} ${car.descripcion}`.toLowerCase().includes(texto);
    const anoMatch = ano === "" || String(car.ano) === ano;
    const precioMatch = Number(car.precio) <= precioMax;
    return textoMatch && anoMatch && precioMatch;
  });

  mostrarVehiculos(filtrados);
}

function aplicarTextosConfig() {
  if (typeof CONFIG_EMPRESA !== "undefined") {
    document.getElementById("txt-tel").innerText = CONFIG_EMPRESA.telefono;
    document.getElementById("txt-correo").innerText = CONFIG_EMPRESA.correoCorporativo;
    document.getElementById("txt-ubicacion").innerText = CONFIG_EMPRESA.ubicacion;
    
    const urlWp = `https://wa.me/${CONFIG_EMPRESA.whatsappNumero}?text=Hola,%20estoy%20interesado%20en%20Crestmont%20Motors`;
    document.getElementById("btn-whatsapp-link").href = urlWp;
    document.getElementById("link-tel-directo").href = urlWp;
  }
}

function abrirModalGaleria(indexVehiculo) {
  const vehiculo = vehiculosGlobal[indexVehiculo];
  if (!vehiculo) return;

  fotosVehiculoActual = vehiculo.imagenes || vehiculo.fotos || [];
  if (fotosVehiculoActual.length === 0) return;

  indiceFotoActual = 0;

  actualizarImagenModal();
  document.getElementById("modal-galeria").style.display = "flex";
}

function actualizarImagenModal() {
  document.getElementById("modal-img").src = fotosVehiculoActual[indiceFotoActual];
  document.getElementById("modal-counter").innerText = `${indiceFotoActual + 1} / ${fotosVehiculoActual.length}`;
}

function cambiarFotoModal(direccion) {
  indiceFotoActual += direccion;
  if (indiceFotoActual < 0) {
    indiceFotoActual = fotosVehiculoActual.length - 1;
  } else if (indiceFotoActual >= fotosVehiculoActual.length) {
    indiceFotoActual = 0;
  }
  actualizarImagenModal();
}

function cerrarModal() {
  document.getElementById("modal-galeria").style.display = "none";
}

function enviarAsesoria(event) {
  event.preventDefault();
  const nombre = document.getElementById("asesoria-nombre").value;
  const tel = document.getElementById("asesoria-tel").value;
  const vehiculo = document.getElementById("asesoria-vehiculo").value || "Consulta General";
  const mensaje = document.getElementById("asesoria-mensaje").value;

  const textoWp = `Hola, mi nombre es *${nombre}* (Tel: ${tel}). Estoy interesado en asesoría para: *${vehiculo}*. Mensaje: ${mensaje}`;
  
  let numeroWp = (typeof CONFIG_EMPRESA !== "undefined" && CONFIG_EMPRESA.whatsappNumero) ? CONFIG_EMPRESA.whatsappNumero : "13170000000";
  const urlWp = `https://wa.me/${numeroWp}?text=${encodeURIComponent(textoWp)}`;
  
  window.open(urlWp, '_blank');
}
