let fotosActualesModal = [];
let indiceActualModal = 0;

document.addEventListener("DOMContentLoaded", function() {
  aplicarTextosConfig();
  inicializarAutosDeMuestra();
  cargarCatalogoPublico();
});

function aplicarTextosConfig() {
  if (typeof CONFIG_EMPRESA !== "undefined") {
    document.getElementById("hero-titulo").innerHTML = `${CONFIG_EMPRESA.nombre}<span>${CONFIG_EMPRESA.sloganPrincipal}</span>`;
    document.getElementById("hero-sub").innerText = CONFIG_EMPRESA.subSlogan;
    document.getElementById("txt-tel").innerText = CONFIG_EMPRESA.telefono;
    document.getElementById("txt-correo").innerText = CONFIG_EMPRESA.correoCorporativo;
    document.getElementById("txt-correo2").innerText = CONFIG_EMPRESA.correoSecundario;
    document.getElementById("txt-ubicacion").innerText = CONFIG_EMPRESA.ubicacion;
    
    const btnWp = document.getElementById("btn-whatsapp-link");
    btnWp.href = `https://wa.me/${CONFIG_EMPRESA.whatsappNumero}?text=Hola,%20estoy%20interesado%20en%20un%20vehículo%20de%20${CONFIG_EMPRESA.nombre}`;
  }
}

function inicializarAutosDeMuestra() {
  let inventario = JSON.parse(localStorage.getItem("inventario_crestmont")) || [];
  if (inventario.length === 0) {
    inventario = [
      {
        vin: "1HGCR2F83HA998877",
        vehiculo: "Toyota Hilux Confort",
        ano: "2024",
        precio: "32000",
        estado: "Disponible",
        descripcion: "Transmisión automática, tracción 4x4, tapicería de cuero impecable.",
        imagenes: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        vin: "4T1B11HK5LU112233",
        vehiculo: "Chevrolet Silverado Z71",
        ano: "2023",
        precio: "45000",
        estado: "Disponible",
        descripcion: "Motor V8, cabina doble, suspensión off-road reforzada.",
        imagenes: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ];
    localStorage.setItem("inventario_crestmont", JSON.stringify(inventario));
  }
}

function cargarCatalogoPublico(listaFiltrada = null) {
  const contenedor = document.getElementById("catalogo-publico");
  contenedor.innerHTML = "";
  
  let inventario = listaFiltrada || JSON.parse(localStorage.getItem("inventario_crestmont")) || [];
  let disponibles = inventario.filter(item => item.estado === "Disponible");

  if (disponibles.length === 0) {
    contenedor.innerHTML = `<div style="text-align:center; color:#777; grid-column:1/-1; padding:30px;">No se encontraron vehículos con los filtros seleccionados.</div>`;
    return;
  }

  disponibles.forEach((auto) => {
    let fotos = auto.imagenes || (auto.imagen ? [auto.imagen] : []);
    let fotoPortada = fotos.length > 0 ? fotos[0] : "";
    
    let thumbHtml = fotoPortada ? `<img src="${fotoPortada}" alt="${auto.vehiculo}">` : `<span style="color:#555;">Sin fotos</span>`;
    let badgeHtml = fotos.length > 1 ? `<div class="photo-badge">📷 ${fotos.length} fotos</div>` : "";
    let fotosJson = encodeURIComponent(JSON.stringify(fotos));

    contenedor.innerHTML += `
      <div class="car-card">
        <div class="car-thumb-container" onclick='abrirModal("${fotosJson}")'>
          ${thumbHtml}
          ${badgeHtml}
        </div>
        <div class="car-details">
          <div class="car-title">${auto.vehiculo} (${auto.ano})</div>
          <div class="car-price">$${Number(auto.precio).toLocaleString()}</div>
          <div class="car-info"><strong>VIN / Chasis:</strong> ${auto.vin}</div>
          <div class="car-desc">${auto.descripcion || "Sin descripción detallada."}</div>
        </div>
      </div>
    `;
  });
}

function aplicarFiltros() {
  const texto = document.getElementById("filtro-texto").value.toLowerCase();
  const ano = document.getElementById("filtro-ano").value;
  const precioMax = parseFloat(document.getElementById("filtro-precio").value) || Infinity;

  let inventario = JSON.parse(localStorage.getItem("inventario_crestmont")) || [];

  let filtrados = inventario.filter(item => {
    const coincideTexto = item.vehiculo.toLowerCase().includes(texto) || item.vin.toLowerCase().includes(texto);
    const coincideAno = ano === "" || item.ano === ano;
    const coincidePrecio = parseFloat(item.precio) <= precioMax;
    return coincideTexto && coincideAno && coincidePrecio;
  });

  cargarCatalogoPublico(filtrados);
}

function abrirModal(fotosCodificadas) {
  try {
    fotosActualesModal = JSON.parse(decodeURIComponent(fotosCodificadas));
  } catch (e) {
    fotosActualesModal = [];
  }
  if (fotosActualesModal.length === 0) return;

  indiceActualModal = 0;
  actualizarModalImagen();
  document.getElementById("modal-galeria").style.display = "flex";
}

function cerrarModal() {
  document.getElementById("modal-galeria").style.display = "none";
}

function cambiarFotoModal(direccion) {
  indiceActualModal += direccion;
  if (indiceActualModal < 0) indiceActualModal = fotosActualesModal.length - 1;
  if (indiceActualModal >= fotosActualesModal.length) indiceActualModal = 0;
  actualizarModalImagen();
}

function actualizarModalImagen() {
  const imgTag = document.getElementById("modal-img");
  const counterTag = document.getElementById("modal-counter");

  imgTag.src = fotosActualesModal[indiceActualModal];
  counterTag.innerText = `${indiceActualModal + 1} / ${fotosActualesModal.length}`;
}
