const defaultVehicles = [
    {
        id: "1",
        title: "Toyota Fortuner 2.7 VVTi",
        year: 2023,
        price: 45000,
        km: "28,000 km",
        trans: "Automática",
        status: "disponible",
        images: [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
        ]
    }
];

function getStoredVehicles() {
    const data = localStorage.getItem("crestmont_vehicles");
    return data ? JSON.parse(data) : defaultVehicles;
}

let activeFilter = "todos";

function renderCatalog() {
    const grid = document.getElementById("vehicle-grid");
    if (!grid) return;

    const vehicles = getStoredVehicles();
    grid.innerHTML = "";

    const filtered = vehicles.filter(v => activeFilter === "todos" || v.status === activeFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay vehículos registrados en esta categoría.</p>`;
        return;
    }

    filtered.forEach(car => {
        const card = document.createElement("div");
        card.className = "car-card";

        const badgeClass = `badge-${car.status}`;
        const whatsappMsg = encodeURIComponent(`Hola Crestmont Motors, estoy interesado en el vehículo: ${car.title} (${car.year}) publicado en $${car.price.toLocaleString()}.`);

        card.innerHTML = `
            <div class="carousel-container">
                <span class="status-badge ${badgeClass}">${car.status}</span>
                <img src="${car.images[0]}" class="carousel-img" id="img-${car.id}" alt="${car.title}">
                ${car.images.length > 1 ? `
                    <button class="carousel-btn prev" onclick="prevImg('${car.id}')"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="carousel-btn next" onclick="nextImg('${car.id}')"><i class="fa-solid fa-chevron-right"></i></button>
                ` : ''}
            </div>
            <div class="car-details">
                <h3>${car.title}</h3>
                <div class="car-price">$${car.price.toLocaleString()}</div>
                <div class="car-specs">
                    <span><i class="fa-solid fa-calendar"></i> ${car.year}</span>
                    <span><i class="fa-solid fa-gauge"></i> ${car.km}</span>
                    <span><i class="fa-solid fa-gear"></i> ${car.trans}</span>
                </div>
                <a href="https://wa.me/584120000000?text=${whatsappMsg}" target="_blank" class="btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeFilter = e.target.getAttribute("data-filter");
            renderCatalog();
        });
    });
});

const imgIndexes = {};
function nextImg(carId) {
    const vehicles = getStoredVehicles();
    const car = vehicles.find(v => v.id === carId);
    if (!car) return;
    imgIndexes[carId] = ((imgIndexes[carId] || 0) + 1) % car.images.length;
    document.getElementById(`img-${carId}`).src = car.images[imgIndexes[carId]];
}

function prevImg(carId) {
    const vehicles = getStoredVehicles();
    const car = vehicles.find(v => v.id === carId);
    if (!car) return;
    imgIndexes[carId] = ((imgIndexes[carId] || 0) - 1 + car.images.length) % car.images.length;
    document.getElementById(`img-${carId}`).src = car.images[imgIndexes[carId]];
}
