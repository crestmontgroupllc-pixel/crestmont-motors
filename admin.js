const ADMIN_PASS = "admin123";

const loginOverlay = document.getElementById("login-overlay");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const adminPassInput = document.getElementById("admin-pass");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const addForm = document.getElementById("add-car-form");

loginBtn.addEventListener("click", () => {
    if (adminPassInput.value === ADMIN_PASS) {
        loginOverlay.style.display = "none";
        adminPanel.style.display = "block";
        loadAdminTable();
    } else {
        loginError.textContent = "Contraseña incorrecta.";
    }
});

logoutBtn.addEventListener("click", () => {
    adminPanel.style.display = "none";
    loginOverlay.style.display = "flex";
    adminPassInput.value = "";
});

function getStoredVehicles() {
    const data = localStorage.getItem("crestmont_vehicles");
    return data ? JSON.parse(data) : [];
}

function saveVehicles(vehicles) {
    localStorage.setItem("crestmont_vehicles", JSON.stringify(vehicles));
}

function loadAdminTable() {
    const tbody = document.getElementById("admin-table-body");
    const vehicles = getStoredVehicles();
    tbody.innerHTML = "";

    if (vehicles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No hay vehículos registrados.</td></tr>`;
        return;
    }

    vehicles.forEach(car => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${car.title}</strong></td>
            <td>${car.year}</td>
            <td>$${car.price.toLocaleString()}</td>
            <td><span class="status-badge badge-${car.status}">${car.status}</span></td>
            <td>
                <button onclick="changeStatus('${car.id}', 'disponible')" class="btn-action disponible">Disponible</button>
                <button onclick="changeStatus('${car.id}', 'reservado')" class="btn-action" style="background:var(--accent-yellow); color:#000;">Reservado</button>
                <button onclick="changeStatus('${car.id}', 'vendido')" class="btn-action vendido">Vendido</button>
                <button onclick="deleteCar('${car.id}')" class="btn-action" style="background:#333; color:#ff5555;"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function changeStatus(id, newStatus) {
    let vehicles = getStoredVehicles();
    let car = vehicles.find(v => v.id === id);
    if (car) {
        car.status = newStatus;
        saveVehicles(vehicles);
        loadAdminTable();
    }
}

function deleteCar(id) {
    if (confirm("¿Estás segura de eliminar este vehículo?")) {
        let vehicles = getStoredVehicles();
        vehicles = vehicles.filter(v => v.id !== id);
        saveVehicles(vehicles);
        loadAdminTable();
    }
}

// Carga directa de imágenes desde el equipo
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("car-images");
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Por favor selecciona al menos una foto.");
        return;
    }

    let imagesArray = [];
    let processedFiles = 0;

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            imagesArray.push(event.target.result);
            processedFiles++;

            if (processedFiles === files.length) {
                const vehicles = getStoredVehicles();
                const newCar = {
                    id: Date.now().toString(),
                    title: document.getElementById("title").value,
                    year: parseInt(document.getElementById("year").value),
                    price: parseFloat(document.getElementById("price").value),
                    km: document.getElementById("km").value,
                    trans: document.getElementById("trans").value,
                    status: "disponible",
                    images: imagesArray
                };

                vehicles.unshift(newCar);
                saveVehicles(vehicles);
                addForm.reset();
                loadAdminTable();
                alert("¡Vehículo y fotos cargados con éxito!");
            }
        };
        reader.readAsDataURL(file);
    });
});