let mapa = null;

document.addEventListener("DOMContentLoaded", function () {
    // Menú lateral
    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, { edge: "right" });

    // Select Materialize
    const selectPlatillos = document.getElementById("listaPlatillos");
    M.FormSelect.init(selectPlatillos);

    // Cargar platillos desde Firestore
    db.collection("platillos").onSnapshot((snapshot) => {
        let opciones = `
            <option value="" disabled selected>Selecciona un platillo</option>
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

    // Guardar pedido
    const formPedido = document.getElementById("formPedido");

    formPedido.addEventListener("submit", function (e) {
        e.preventDefault();

        const opcionSeleccionada =
            selectPlatillos.options[selectPlatillos.selectedIndex];

        const platilloNombre = opcionSeleccionada
            ? opcionSeleccionada.textContent.trim()
            : "";

        const pedidoNuevo = {
            platilloId: selectPlatillos.value,
            platilloNombre: platilloNombre,
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

        db.collection("pedidos").add(pedidoNuevo)
            .then((docRef) => {
                const codigoPedido = docRef.id;

                console.log("Pedido guardado:", codigoPedido);

                const resultadoPedido =
                    document.getElementById("resultadoPedido");

                const codigoElemento =
                    document.getElementById("codigoPedido");

                resultadoPedido.style.display = "block";
                codigoElemento.textContent = codigoPedido;

                // Crear información del pedido
                let informacionPedido =
                    document.getElementById("informacionPedido");

                if (!informacionPedido) {
                    informacionPedido = document.createElement("div");
                    informacionPedido.id = "informacionPedido";

                    resultadoPedido.insertBefore(
                        informacionPedido,
                        document.getElementById("codigoPedido").parentElement
                    );
                }

                informacionPedido.innerHTML = `
                    <div style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        gap:25px;
                        flex-wrap:wrap;
                        margin:20px 0;
                    ">
                        <div style="
                            background:white;
                            padding:10px;
                            border-radius:10px;
                        ">
                            <div id="qrcode"></div>
                        </div>

                        <div style="
                            text-align:left;
                            min-width:250px;
                            max-width:400px;
                        ">
                            <p><strong>Nombre:</strong> ${pedidoNuevo.nombre}</p>
                            <p><strong>Platillo:</strong> ${pedidoNuevo.platilloNombre}</p>
                            <p><strong>Dirección:</strong> ${pedidoNuevo.direccion}</p>
                        </div>
                    </div>
                `;

                // Generar QR
                const qrElemento = document.getElementById("qrcode");
                qrElemento.innerHTML = "";

                new QRCode(qrElemento, {
                    text: codigoPedido,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                // Limpiar formulario
                formPedido.reset();
                M.FormSelect.init(selectPlatillos);

                // Eliminar mapa
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

    // Botón ubicación
    document.getElementById("btnDireccion")
        .addEventListener("click", obtenerUbicacion);
});

// Obtener ubicación
function obtenerUbicacion() {
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        return;
    }

    navigator.geolocation.getCurrentPosition(exito, error);
}

// Ubicación obtenida
function exito(posicion) {
    const latitud = posicion.coords.latitude;
    const longitud = posicion.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("direccion").value = data.display_name;

            M.textareaAutoResize(
                document.getElementById("direccion")
            );

            if (mapa !== null) {
                mapa.remove();
            }

            mapa = L.map("mapa");
            mapa.setView([latitud, longitud], 16);

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution: "&copy; OpenStreetMap"
                }
            ).addTo(mapa);

            L.marker([latitud, longitud])
                .addTo(mapa)
                .bindPopup("Tu ubicación")
                .openPopup();

            setTimeout(function () {
                mapa.invalidateSize();
            }, 300);
        })
        .catch(error => {
            console.error(error);
            alert("No se pudo obtener la dirección.");
        });
}

// Error de geolocalización
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