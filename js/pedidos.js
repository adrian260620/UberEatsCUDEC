document.addEventListener('DOMContentLoaded', function () {

    // Menú lateral
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});


    // Inicializar select de Materialize
    const selectPlatillos = document.querySelector("#listaPlatillos");

    M.FormSelect.init(selectPlatillos);


    // Cargar platillos desde Firestore

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



    // Guardar pedido

    const formPedido = document.querySelector("#formPedido");


    formPedido.addEventListener("submit", (e) => {

        e.preventDefault();


        const pedidoNuevo = {

            platilloId: selectPlatillos.value,

            nombre: formPedido.nombre.value,

            direccion: formPedido.direccion.value,

            fecha: new Date()

        };


        if (!pedidoNuevo.platilloId ||
            !pedidoNuevo.nombre ||
            !pedidoNuevo.direccion) {

            alert("Completa todos los campos");
            return;

        }


        db.collection("pedidos")
        .add(pedidoNuevo)

        .then((doc) => {

            console.log("Pedido guardado:", doc.id);

            alert("Pedido guardado correctamente");

            formPedido.reset();

        })

        .catch((error) => {

            console.log("Error al guardar pedido:", error);

            alert("Error al guardar pedido");

        });


    });

});