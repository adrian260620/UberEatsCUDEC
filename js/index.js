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

    contenido = `
    <div class="card-panel recipe white row" id="${id}" data-id="${id}">
        
        <div class="recipe-details">

            <div class="recipe-title">
                ${platillo.nombre}
            </div>

            <div class="recipe-ingredients">
                ${platillo.ingredientes}
            </div>

            <div class="recipe-price">
                $${platillo.precio}
            </div>

            <div class="recipe-delete">
                <i class="material-icons" data-id="${id}">
                    delete_outline
                </i>
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

    if (!confirmar) {
        return;
    }


    const recipe = document.querySelector(`.recipe[data-id="${id}"]`);


    if (recipe) {
        recipe.remove();
    }

};
