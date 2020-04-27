//Promesas: Clase 05

            const getUser = new Promise(function(todoBien, todoMal){
              setTimeout(function(){todoMal('se acabo el tiempo 0')},3000)
            })

              getUser
                .then(function(){
                  console.log('todo esta bien en la vida');
                })
                .catch(function(mensaje){
                  console.log(mensaje);
                })

            //Multiples promesas:

            const getUser1 = new Promise(function(todoBien, todoMal){
              setTimeout(function(){todoBien('se acabo el tiempo 1')},3000)
            })

            Promise.all([getUser1,getUser1])
              .then(function(mensaje1){
                console.log(mensaje1);
              })
              .catch(function(mensaje1){
                console.log(mensaje1);
              })

//Ajax en JQuery y JavaSript : CLASE 06

          //Con Ajax (JQuery)
          $.ajax('https://randomuser.me/api/', {
            method: 'GET',
            success: function(data){
              console.log(data);
            },
            error: function(error){
              console.log(error);
            }
          })


          //con JS
          fetch('https://randomuser.me/api/sdsfjdbfj')  //fetch devuelve una promesa
            .then(function(response){
              //console.log(response);
              return response.json() //devuelve una promesa
            })
            .then(function(data){  //este then es de la promesa de response.json
              console.log('user', data.results[0].name.first);
            })
            .catch(function(){
              console.log('Algo ha fallado');
            });

//Funciones Asincronas: Clase 07 --------------------------IMPORTANTE--------------------
            //Esto devuelve movies de action
(async function load(){
try{
  const response = await fetch('https://yts.mx/api/v2/list_movies.json?genre=action')
  //await sirve para esperar las peticiones de nuestro API
  const data = await response.json()
  console.log(data);
}catch(error){
  console.log(error);
}

})();

//Podemos hacerlo reutilizable

(async function load1(){

  async function getData(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  const $form = document.getElementById('form')
  const $home = document.getElementById('home')
  const $featuringCotainer = document.getElementById('featuring')

  function setAttribute($element,attributes){
    for(const attribute in attributes){
      $element.setAttribute(attribute,attributes[attribute])
    }
  }

  const BASE_API = 'https://yts.mx/api/v2/'

  function featuringTemplate(peli){
    return(
      `<div class="featuring">
          <div class="featuring-image">
            <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${peli.title}</p>
          </div>
       </div>`)
  }

  $form.addEventListener('submit',async function(event){
    event.preventDefault() //Sirve para que la pagina o url no se recargue al hacer el submit
    $home.classList.add('search-active')
    const $loader = document.createElement('img')
    setAttribute($loader,{
      src:'src/images/loader.gif',
      height:50,
      width:50,
    })
    $featuringCotainer.append($loader)
    const data = new FormData($form)
    const peli = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`) //Peticiones web dentro de una URL
    //data.get('name') ---->  te bota el nombre de la bbusqueda que hagas.
    const HTMLString = featuringTemplate(peli.data.movies[0])
    $featuringCotainer.innerHTML = HTMLString
    
  })

  const actionList = await getData(`${BASE_API}list_movies.json?genre=action`)
  const dramaList = await getData(`${BASE_API}list_movies.json?genre=drama`)
  const animationList = await getData(`${BASE_API}list_movies.json?genre=animation`)
  console.log('actionList',actionList);
  console.log('terrorList',dramaList);
  console.log('dramaList',animationList);


function videoItemTemplate(movie){
  return (

    `<div class="primaryPlaylistItem">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
     </div>`

  )
}

function createTemplate(HTMLString){
  const html = document.implementation.createHTMLDocument();
  html.body.innerHTML = HTMLString

  return html.body.children[0]
}

function addEventClick($element){
  $element.addEventListener('click',function(){
    showModal()
  })
}


function renderMovieList(list,$container){
  $container.children[0].remove()
  list.forEach((movie) => {
    const HTMLString = videoItemTemplate(movie)
    const movieElement = createTemplate(HTMLString)
    $container.append(movieElement)
    addEventClick(movieElement)
  });
}

const $actionContainer = document.getElementById('action')
const $dramaContainer = document.getElementById('drama')
const $animationContainer = document.getElementById('animation')

renderMovieList(actionList.data.movies,$actionContainer)
renderMovieList(dramaList.data.movies,$dramaContainer)
renderMovieList(animationList.data.movies,$animationContainer)






const $modal = document.getElementById('modal')
const $overlay = document.getElementById('overlay')
const $hideModal = document.getElementById('hide-modal')

const $modalTitle = $modal.querySelector('h1')
const $modalImage = $modal.querySelector('img')
const $modalDescription = $modal.querySelector('p')

function showModal(){
  $overlay.classList.add('active')
  $modal.style.animation ='modalIn .8s forwards'
}

$hideModal.addEventListener('click', hideModal)

function hideModal(){
  $overlay.classList.remove('active')
  $modal.style.animation ='modalOut .8s forwards'
}

})()

//Selectores: Clase 08


//ESTO SE HACE EN JQUERY

//ejm .home
//  $('.home')  ---------->  Aca estoy trayendo al elemento con la clase home que tenga nuestro html
//  const $home = $('.home')  --------> Tambien lo podemos poner dentro de una 'variable'

//ESTO SE HACE EN JAVASCRIPT

// const $home = document.getElementById('modal')
//getElementsByTagName
//getElementsByClassName:
//querySelector:
//querySelectorAll:

//-----------------------------------SEMANA14--------------------------------------
/*
Para crear un elemento de html de otra manera:

  Por ejm:Agregar atributos
  const $loader = document.createElement('img')
  -------En Js--------
  $loader.setAttribute('src','img/direccion.jpg')

  -------En JQuery------
  $('selector').attr('clave','valor')
  $('selector').attr({'src':'valor',height:'50px'})

  Cuando se tiene un objeto ejm:
  {
  src:'img/fdgdg.jpg',
  height: 50,
  width: 50,
  }

  El objeto lo asignamos a la variable x: Asi le aumentamos un nuevo valor:
  x['nuevoKey'] = 'nuevo valor'

  ejm:
  x[width] me daria 50

*/
