const BASE_URL ='https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users';
const userCards = document.querySelector('.user-cards');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector('.paginator');
const UserCardsList = JSON.parse(localStorage.getItem('favoriteUsers'));
const USER_PER_PAGE = 12;
function renderUserCards(list){
  let rawHTML = '';
  list.forEach(item =>{
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

                <i class="fa-solid fa-heart fa-2xl red-heart remove-btn" data-id ="${item.id}"></i>
              
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
  let startPage = (page - 1)* USER_PER_PAGE;
  return UserCardsList.slice(startPage , startPage + USER_PER_PAGE);

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

function removeFavoriteUser(id){
  let removeIndex = UserCardsList.findIndex( user => user.id === id);
  console.log(removeIndex);
  if(UserCardsList.length < 0)return
  UserCardsList.splice(removeIndex,1);
  localStorage.setItem('favoriteUsers',JSON.stringify(UserCardsList));
  renderUserCards(UserCardsList);

}

paginator.addEventListener('click',(event) => {
  if (event.target.tagName !== 'A')return
    const page = Number(event.target.dataset.page);
    renderUserCards(getUserByPage(page));
})
userCards.addEventListener('click',(event) => {
  if(event.target.matches('.btn-primary')){
    console.log(event.target.dataset)
    showUserCards(Number(event.target.dataset.id))
  }else if(event.target.matches('.remove-btn')){
    removeFavoriteUser(Number(event.target.dataset.id))
  }
})

renderPaginator(UserCardsList.length);
renderUserCards(getUserByPage(1)) ;



