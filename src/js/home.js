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
    if(data.data.movie_count > 0){
      return data
    }

    throw new Error('No se encontro ningun resultado.')
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
    try{
      const {data: {movies: pelis}} = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`) //Peticiones web dentro de una URL
      //data.get('name') ---->  te bota el nombre de la bbusqueda que hagas.
      const HTMLString = featuringTemplate(pelis[0])
      $featuringCotainer.innerHTML = HTMLString
    }catch(error){
      alert(error.message)
      $loader.remove()
      $home.classList.remove('search-active')

    }


  })

function videoItemTemplate(movie, category){
  return (

    `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
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
    showModal($element)
  })
}


function renderMovieList(list,$container,category){
  $container.children[0].remove()
  list.forEach((movie) => {
    const HTMLString = videoItemTemplate(movie,category)
    const movieElement = createTemplate(HTMLString)
    $container.append(movieElement)
    const image = movieElement.querySelector('img')
    image.addEventListener('load',(event) => { //Evento para que detecte que la imagen haye terminado de cargar
      event.srcElement.classList.add('fadeIn')  //Tambien pudo ser image.classList.add('fadeIn')
    })
    addEventClick(movieElement)
  });
}

const $actionContainer = document.getElementById('action')
const $dramaContainer = document.getElementById('drama')
const $animationContainer = document.getElementById('animation')

async function cacheExist(category){
  const listName = `${category}List`
  const cacheList = window.localStorage.getItem(listName)

  if(cacheList){
    return JSON.parse(cacheList)
  }

  const {data:{movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`)
  window.localStorage.setItem(listName,JSON.stringify(data)) //Sirve para una vez hecho la peticion la guardamos en localStorage
  return data
}

//const {data:{movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
const actionList =  await cacheExist('action')
renderMovieList(actionList,$actionContainer,'action')

const  dramaList = await cacheExist('drama')
renderMovieList(dramaList,$dramaContainer,'drama')

const animationList = await cacheExist('animation')
renderMovieList(animationList,$animationContainer,'animation')






const $modal = document.getElementById('modal')
const $overlay = document.getElementById('overlay')
const $hideModal = document.getElementById('hide-modal')

const $modalTitle = $modal.querySelector('h1')
const $modalImage = $modal.querySelector('img')
const $modalDescription = $modal.querySelector('p')

function findById(list,id){
  return list.find(movie => movie.id === parseInt(id,10))
}

function findMovie(id,category){
  switch(category){
    case 'action' : {
      return findById(actionList,id)
    }
    case 'drama': {
      return findById(dramaList,id)
    }
    default: {
      return findById(animationList,id)
    }
  }

}

function showModal($element){
  $overlay.classList.add('active')
  $modal.style.animation ='modalIn .8s forwards'
  const id = $element.dataset.id
  const category = $element.dataset.category
  const data = findMovie(id,category)

  $modalTitle.textContent = data.title
  $modalImage.setAttribute('src',data.medium_cover_image)
  $modalDescription.textContent = data.description_full
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

  ------------------------------SEMANA 15----------------------------------
  Formulario:
  new FormData('$elemento')

  ------------------------------SEMANA 16----------------------------------
  destructuracion de objetos:
  const {
    data: {
      movies: pelis
    }
  } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)

  ------------------------------SEMANA 17----------------------------------
  hicimos los dataset como atributos dentro de los elementos html DOM

  ------------------------------SEMANA 18----------------------------------
  Hicimos encontrar por id y categoria: ejm
  list.find(movie => movie.id === parseInt(id,10))

    ------------------------------SEMANA 19----------------------------------
    image.addEventListener('load',(event) => { //Evento para que detecte que la imagen haye terminado de cargar
      event.srcElement.classList.add('fadeIn')  //Tambien pudo ser image.classList.add('fadeIn')
    })

    ------------------------------SEMANA 20----------------------------------
    Se hizo manejo de errores try catch
    Creacion de errores ejemplo:
      throw new Error('No se encontro ningun resultado.')

      new : sirve para crear un nuevo console.error(
      throw: sirve para ejecutarlo

    se le puede pasar a un alert
    alert(error.message)
    );

    ------------------------------SEMANA 21----------------------------------
    LocalStorage
    window.LocalStorage.setItem('nombre','jose')
    window.LocalStorage.getItem('nombre')------->'jose'
    window.LocalStorage.setItem('nombre',JSON.stringify({'peli': 'wonder woman'})) Si lo llamas te devuelve en forma de string
    Puedes pasar de string a objeto
    JSON.parse(window.LocalStorage.getItem('nombre'))

*/
