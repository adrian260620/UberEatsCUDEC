let contenido = "";
document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostrarplatillo(platillo, id) {
  contenido = `
  <div class='card-pannel recipe white row'>
  <div class='recipe-details'>
    <div class='recipe-tittle'>
      ${platillo.nombre}
      </div>
      <div class='recipe.ingredients'>
        ${platillo.ingredientes}
        </div>


  </div>
  </div>
  `;
  document.querySelector(".recipes").innerHTML += contenido;
};