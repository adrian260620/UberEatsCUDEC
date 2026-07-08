let mapa = null;

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // Menú lateral
    // ==========================
    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, {
        edge: "right"
    });

    // ==========================
    // Select Materialize
    // ==========================
    const selectPlatillos = document.getElementById("listaPlatillos");

    M.FormSelect.init(selectPlatillos);

    // ==========================
    // Cargar platillos desde Firestore
    // ==========================
    db.collection("platillos").onSnapshot((snapshot) => {

        let opciones = `
            <option value="" disabled selected>
                Selecciona un platillo
            </option>
        `;

        snapshot.forEach((doc) => {

            const platillo = doc.data();

            opciones += `
                <option value="${doc.id}">
                    ${platillo.nombre} - $${platillo.precio}
                </option>
            `;

        });

        selectPlatillos.innerHTML = opciones;

        M.FormSelect.init(selectPlatillos);

    });

    // ==========================
    // Guardar pedido
    // ==========================
    const formPedido = document.getElementById("formPedido");

    formPedido.addEventListener("submit", function (e) {

        e.preventDefault();

        const pedidoNuevo = {

            platilloId: selectPlatillos.value,
            nombre: formPedido.nombre.value.trim(),
            direccion: formPedido.direccion.value.trim(),
            fecha: new Date()

        };

        if (
            pedidoNuevo.platilloId === "" ||
            pedidoNuevo.nombre === "" ||
            pedidoNuevo.direccion === ""
        ) {

            alert("Completa todos los campos.");
            return;

        }

        db.collection("pedidos")
            .add(pedidoNuevo)
            .then(() => {

                alert("Pedido guardado correctamente.");

                formPedido.reset();

                M.FormSelect.init(selectPlatillos);

                if (mapa) {
                    mapa.remove();
                    mapa = null;
                }

            })
            .catch((error) => {

                console.error(error);

                alert("Error al guardar el pedido.");

            });

    });

    // ==========================
    // Botón ubicación
    // ==========================
    document.getElementById("btnDireccion")
        .addEventListener("click", obtenerUbicacion);

});


// ======================================
// Obtener ubicación
// ======================================
function obtenerUbicacion() {

    if (!navigator.geolocation) {

        alert("Tu navegador no soporta geolocalización.");

        return;

    }

    navigator.geolocation.getCurrentPosition(exito, error);

}


// ======================================
// Ubicación obtenida
// ======================================
function exito(posicion) {

    const latitud = posicion.coords.latitude;
    const longitud = posicion.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`)
        .then(response => response.json())
        .then(data => {

            // Dirección completa
            document.getElementById("direccion").value = data.display_name;

            // Actualizar el textarea de Materialize
            M.textareaAutoResize(document.getElementById("direccion"));

            // Si ya existe un mapa, eliminarlo
            if (mapa !== null) {
                mapa.remove();
            }

            // Crear el mapa
            mapa = L.map("mapa");

            // Centrar en la ubicación
            mapa.setView([latitud, longitud], 16);

            // Agregar el mapa de OpenStreetMap
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap"
            }).addTo(mapa);

            // Agregar un marcador
            L.marker([latitud, longitud])
                .addTo(mapa)
                .bindPopup("Tu ubicación")
                .openPopup();

            // Obligar a Leaflet a redibujar el mapa
            setTimeout(function () {
                mapa.invalidateSize();
            }, 300);

        })
        .catch(error => {

            console.error(error);
            alert("No se pudo obtener la dirección.");

        });

}


// ======================================
// Error de geolocalización
// ======================================
function error(err) {

    console.error(err);

    switch (err.code) {

        case err.PERMISSION_DENIED:
            alert("Debes permitir el acceso a la ubicación.");
            break;

        case err.POSITION_UNAVAILABLE:
            alert("No fue posible obtener la ubicación.");
            break;

        case err.TIMEOUT:
            alert("La solicitud tardó demasiado.");
            break;

        default:
            alert("Ocurrió un error al obtener la ubicación.");

    }

}
