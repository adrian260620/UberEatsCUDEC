db.collection("platillos").onSnapshot((coleccion) => {
coleccion.forEach((registro) => {
mostrarplatillo(registro.data(), registro.id);
});
});