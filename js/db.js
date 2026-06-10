db.collection("platillos").onSnapshot((coleccion) => {
coleccion.docChanges().forEach((registro) => {
    if (registro.type === "added"){
mostrarplatillo(registro.doc.data(), registro.doc.id);
    }
    if (registro.type === "modified"){
        actualizarplatillo(registro.doc.data(), registro.doc.id);
    }
});
});