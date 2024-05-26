const BASE_URL ='https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users';
const userCards = document.querySelector('.user-cards');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector('.paginator');
let filteredUserList = [];
const UserCardsList =[];
USER_PER_PAGE = 12;

function renderUserCards(list){
  const favoriteUsers = JSON.parse(localStorage.getItem('favoriteUsers'));
  let rawHTML = '';
  list.forEach(item =>{
    const isFavorite = favoriteUsers.some(user => user.id === item.id);
    rawHTML += `
      <div class="col m-2">
          <div class="card" style="width: 18rem">
            <img src="${item.avatar}" class="card-img-top img-fluid" alt="user-avatar" />
            <div class="card-body">
              <h5 class="card-user-name">${item.name}${item.surname}</h5>
              <div class="d-flex justify-content-end ">
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#user-info-modal" data-id="${item.id}">
              More
            </button>

              
                <i class="fa-solid fa-heart fa-2xl favorite-btn ${isFavorite ? 'red-heart':''}" data-id ="${item.id}"></i>
             
              </div>
            </div>
          </div>
        </div>
    `
  })
  return userCards.innerHTML = rawHTML;
}

function renderPaginator(amount){
  let pageNumber = Math.ceil(amount/USER_PER_PAGE);
  let rawHTML = `<li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
  for (let page = 1; page <= pageNumber; page++){
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
  }
  rawHTML += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`
  paginator.innerHTML = rawHTML;
}
function getUserByPage(page){
  const data = filteredUserList.length ? filteredUserList : UserCardsList;
  let startPage = (page - 1)* USER_PER_PAGE;
  return data.slice(startPage , startPage + USER_PER_PAGE);

}

function addFavoriteUsers(id){
  const list = JSON.parse(localStorage.getItem('favoriteUsers'))||[];
  const userList = UserCardsList.find((userList) => userList.id === id)
  
    if(list.some((userList) => userList.id === id)){
      return alert("this user has already been added")
    }
    list.push(userList);
    console.log(list)
    localStorage.setItem('favoriteUsers',JSON.stringify(list));
    
  }


function showUserCards(id){
  const userModalName = document.querySelector("#user-modal-name");
  const userModalImage = document.querySelector("#user-modal-image");
  const userModalDescription = document.querySelector("#user-modal-description");
  axios.get(INDEX_URL+'/'+id).then(response => {
    const data = response.data;
   userModalName.innerText =`${data.name+data.surname}`;
   userModalImage.innerHTML =`<img
                  src="${data.avatar}"
                  alt="user-avatar"
                  class="img-fluid"
                />`
   userModalDescription.innerHTML = `<ul>
                    <li>Birthday:${data.birthday}</li>
                    <li>Gender:${data.gender}</li>
                    <li>Region:${data.region}</li>
                    <li>E-mail:${data.email}</li>
                  </ul>`
})}

paginator.addEventListener('click',(event) => {
  if (event.target.tagName !== 'A')return
    const page = Number(event.target.dataset.page);
    renderUserCards(getUserByPage(page));
})
userCards.addEventListener('click',(event) => {
  if(event.target.matches('.btn-primary')){
    console.log(event.target.dataset)
    showUserCards(Number(event.target.dataset.id))
  }else if(event.target.matches('.favorite-btn')){
    event.target.classList.add('red-heart')
    addFavoriteUsers(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit',(event) => {
  event.preventDefault();
  let keyword = searchInput.value.trim().toLowerCase();
  filteredUserList = UserCardsList.filter((userList) => userList.name.toLowerCase().includes(keyword));
  renderUserCards(filteredUserList);
  renderPaginator(filteredUserList.length);
  
})
axios.get(INDEX_URL).then(response => {
  UserCardsList.push(...response.data.results)
  renderUserCards(getUserByPage(1))
  renderPaginator(UserCardsList.length)
}).catch(error => console.log(error))



