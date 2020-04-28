(async function load2(){

  async function getData(url){
      const response = await fetch(url)
      const data = await response.json()
      return data
  }

  const $friend = document.getElementById('friendzone')

function friendItemTemplate(user){
  return (

    `<li class="playlistFriends-item">
      <a href="#">
        <img src="${user.picture.large}" alt="echame la culpa" />
        <span>
          ${user.name.first} ${user.name.last}
        </span>
      </a>
    </li>`

  )
}

function createTemplate(HTMLString){
  const html = document.implementation.createHTMLDocument();
  html.body.innerHTML = HTMLString

  return html.body.children[0]
}

function renderFriendList(list,$container){
  list.forEach((user) => {
    const HTMLString = friendItemTemplate(user)
    const friendElement = createTemplate(HTMLString)
    $container.append(friendElement)
  });
}

const numUser='20'
const URL_API=`https://randomuser.me/api/?results=${numUser}`

const {results: listFriends} = await getData(URL_API)
renderFriendList(listFriends,$friend)

})()
