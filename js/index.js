let contenido = "";

document.addEventListener('DOMContentLoaded', function() {
    // Menú lateral
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});

    // Formulario lateral
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
});

// Mostrar platillo
function mostrarplatillo(platillo, id) {
    let fotoplatillo = platillo.foto ? platillo.foto : "img/no-image.png";

    contenido = `
    <div class="card-panel recipe white row" id="${id}" data-id="${id}">
        <img src="${fotoplatillo}" height="100px" width="100px" alt="Foto de ${platillo.nombre}">
        <div class="recipe-details">
            <div class="recipe-title">${platillo.nombre}</div>
            <div class="recipe-ingredients">${platillo.ingredientes}</div>
            <div class="recipe-price">$${platillo.precio}</div>
            <div class="recipe-delete">
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
    </div>
    `;
    document.querySelector(".recipes").innerHTML += contenido;
}

// Actualizar platillo
function actualizarplatillo(platillo, id) {
    const tarjeta = document.getElementById(id);
    if (tarjeta) {
        tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;
        tarjeta.querySelector(".recipe-ingredients").innerHTML = platillo.ingredientes;
        tarjeta.querySelector(".recipe-price").innerHTML = "$" + platillo.precio;
    }
}

// Borrar platillo visualmente
const borrarPlatillo = (id) => {
    const confirmar = confirm("¿Estas seguro que quieres borrar este platillo?");
    if (!confirmar) return;

    const recipe = document.querySelector(`.recipe[data-id="${id}"]`);
    if (recipe) recipe.remove();
};

// --- Cámara y fotos ---
let streaming = false;
const width = 320;
let height = 0;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const fotoImg = document.getElementById('fotoImg');   // <img id="fotoImg">
const fotoInput = document.getElementById('fotoInput'); // <input id="fotoInput" type="hidden">
const btnFoto = document.getElementById('btn-foto');

// Iniciar cámara
btnFoto.addEventListener('click', function() {
   navigator.mediaDevices.getUserMedia({ video: true, audio: false })
   .then((stream) => {
      video.srcObject = stream;
      video.play();
   })
   .catch((error) => {
      console.log(error);
   });
});

video.addEventListener("canplay", () => {
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        streaming = true;
    }
});

// Tomar foto
function tomarFoto() {
    const contexto = canvas.getContext("2d");
    if (width && height){
        canvas.width = width;
        canvas.height = height;
        contexto.drawImage(video, 0, 0, width, height);
        const fotoFinal = canvas.toDataURL("image/png"); // base64
        fotoImg.setAttribute("src", fotoFinal);
        fotoInput.value = fotoFinal; // ahora sí se guarda en el input hidden
    } else {
        limpiarFoto();
    }
}

function limpiarFoto() {
    const contexto = canvas.getContext("2d");
    contexto.fillStyle = "#AAA";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    fotoImg.setAttribute("src", "img/no-image.png");
    fotoInput.value = "";
}

// --- Guardar platillo con foto en Firestore ---
document.querySelector('.add-recipe').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('title').value;
    const ingredientes = document.getElementById('ingredients').value;
    const precio = document.getElementById('precio').value;
    const fotoBase64 = fotoInput.value;

    // Guardar en Firestore directamente con base64
    await firebase.firestore().collection('platillos').add({
        nombre: nombre,
        ingredientes: ingredientes,
        precio: precio,
        foto: fotoBase64 ? fotoBase64 : "img/no-image.png"
    });

    alert("Platillo agregado con foto!");
});
