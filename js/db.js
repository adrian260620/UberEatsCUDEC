db.collection("platillos").onSnapshot((coleccion) => {
coleccion.docChanges().forEach((registro) => {
    if (registro.type === "added"){
mostrarplatillo(registro.doc.data(), registro.doc.id);
const selectPlatillos = document.getElementById('listaPlatillos')
if (selectPlatillos){
agregarAlista(registro.doc.data(), registro.doc.id);
    }
}
    if (registro.type === "modified"){
        actualizarplatillo(registro.doc.data(), registro.doc.id);
    }
    if (registro.type === "removed"){
        borrarPlatillo(registro.doc.id);
    }
});
});

const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const platilloNuevo = {
        ingredientes: formularioAgregar.ingredients.value,
        nombre: formularioAgregar.title.value,
        precio: formularioAgregar.price.value
    }
    db.collection("platillos").add(platilloNuevo)
    .catch((error) => {
        console.log(error);
        alert("Error al agregar el platillo");
    }
);
formularioAgregar.ingredients.value = "";
formularioAgregar.tittle.value = "";
formularioAgregar.price.value = "";
alert("Platillo agregado");
})

const platilloBorrar = document.querySelector(".recipes");
platilloBorrar.addEventListener("click", (e) => {
    if (e.target.tagName === 'I'){
        const id = e.target.getAttribute("data-id");
        db.collection("platillos").doc(id).delete();
    }
})