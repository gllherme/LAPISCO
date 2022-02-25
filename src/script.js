// Declara uma variável para a pagina que a API está carregando
let page = 1

// Declara uma array onde serão guardados os resultados da API
const userData = []

// Alterna a classe do html que define a visibilidade da animação de loading
function toggleLoading(loading) {
    const element = document.querySelector('.loading')
    if (loading) {
        element.classList.remove('hidden')
    } else {
        element.classList.add('hidden')
    }
}

// Obtem os dados da API
async function getUserData(numberOfElements) {
    toggleLoading(true)
    const response = await fetch(`https://randomuser.me/api/?results=${numberOfElements}&page=${page}`)
    const result = await response.json()
    toggleLoading(false)
    return result["results"]
}

// Carrega e filtra os dados da API e guarda na array "userData"
async function loadUserData(numberOfElements) { 
    const userDataJson = await getUserData(numberOfElements)
    const newUser = userDataJson.map((user, index) => ({
        id: `${page}-${index}`,
        name: `${user.name.first} ${user.name.last}`,
        gender: user.gender,
        cellPhone: user.cell,
        email: user.email,
        age: user.registered.age,
        imageURL: user.picture.medium
        
    }));
    renderUserCard(newUser)
    userData.push(...newUser)
}

// Cria um elemento HTML contendo as informações geradas pela API
function renderUserCard(userData) {
    userData.forEach(user => {
        const card = document.createElement('div')
        card.classList.add(`user-card`)
        card.innerHTML = `<div class="user-img">
                            <img src="${user.imageURL}" alt="imagem">
                          </div>
                          <div class="user-description">
                            <p class="card-title">${user.name}</p>
                            <p class="subtitle">${user.gender == "male" ? "Masculino" : "Feminino"} - ${user.age} Anos</p>
                            <p class="subtitle">${user.cellPhone}</p>
                            <p class="card-email">${user.email}</p>
                          </div>`
        card.setAttribute('id', user.id)
        document.querySelector('.user-list').appendChild(card)
    })
}

// Scroll infinito para gerar mais resultados
window.addEventListener('scroll', () => {
    if (window.scrollY + (window.innerHeight + 15) >= document.documentElement.scrollHeight) {
        page++
        loadUserData(16)
    }
})

// Sistema de busca
function searchUserByName(name) {
    return userData.filter((user) => {
        return user.name.toLowerCase().includes(name.toLowerCase())
    })
}

// Filtra a busca e define a visibilidade dos cards não relevantes por meio do CSS
const searchElement = document.getElementById('search')
searchElement.value = ""
searchElement.onkeyup = () => {
    const filteredSearch = searchUserByName(searchElement.value).map((user) => user.id)
    const allUserCards = document.querySelectorAll('.user-card')
    Array.from(allUserCards).map((card) => {
        if (filteredSearch.includes(card.getAttribute('id'))) {
            card.classList.remove('hidden')
        } else {
            card.classList.add('hidden')
        }
    })
}

loadUserData(16)
