/* Enlace no destructivo entre la portada original y los nuevos mundos.
   Incluye este script AL FINAL del index.html, antes de </body>.
   La captura del click impide que salte la antigua ventana modal. */
(function(){
  const links={'Lengua':'lengua','Matemáticas':'matematicas','CC. Sociales':'sociales'};
  function init(){
    document.querySelectorAll('.world').forEach(function(button){
      const key=links[button.dataset.name];
      if(!key)return;
      button.addEventListener('click',function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        window.location.assign('mundo.html?asignatura='+key);
      },true);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
