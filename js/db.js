// Mostrar platillos en tiempo real
db.collection("platillos").onSnapshot((datos) => {

    datos.docChanges().forEach((registro) => {

        if (registro.type === "added") {
            mostrarplatillo(registro.doc.data(), registro.doc.id);
        }

        if (registro.type === "modified") {
            actualizarplatillo(registro.doc.data(), registro.doc.id);
        }

        if (registro.type === "removed") {
            borrarPlatillo(registro.doc.id);
        }

    });

});


// Formulario para agregar platillo
const formularioAgregar = document.querySelector(".add-recipe");

formularioAgregar.addEventListener("submit", (e) => {

    e.preventDefault();

    const platilloNuevo = {
        ingredientes: formularioAgregar.ingredients.value,
        nombre: formularioAgregar.title.value,
        precio: formularioAgregar.price.value
    };


    db.collection("platillos").add(platilloNuevo)
    .then((doc) => {

        console.log("Platillo guardado con ID:", doc.id);

        formularioAgregar.ingredients.value = "";
        formularioAgregar.title.value = "";
        formularioAgregar.price.value = "";

        alert("Platillo agregado correctamente");

    })
    .catch((error) => {

        console.log("Error al guardar:", error);
        alert("Error al agregar el platillo");

    });

});


// Eliminar platillo desde el icono borrar
const platilloBorrar = document.querySelector(".recipes");

platilloBorrar.addEventListener("click", (e) => {

    if (e.target.tagName === "I") {

        const id = e.target.getAttribute("data-id");

        db.collection("platillos")
        .doc(id)
        .delete()
        .then(() => {
            console.log("Platillo eliminado");
        })
        .catch((error) => {
            console.log("Error al eliminar:", error);
        });

    }

});
