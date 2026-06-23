db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.docChanges().forEach((registro) => {
        if (registro.type === "added"){
    mostrarplatillo(registro.doc.data(), registro.doc.id);
    const selectPlatillos = document.getElementById('listaPlatillos')
    if (selectPlatillos){
    agregarAlista(registro.doc.data(), registro.doc.id);
        }
    }
    });
    });