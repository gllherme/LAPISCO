// Obtem os dados da API
async function getUserData(numberOfElements) {
    const response = await fetch(`https://randomuser.me/api/?results=${numberOfElements}`)
    const result = await response.json()
    return result["results"]
}

// Carrega e filtra os dados da API
async function loadUserData(numberOfElements) { 
    let userDataJson = await getUserData(numberOfElements)
    
    userDataJson.forEach(user => {
        const name = `${user["name"]["first"]} ${user["name"]["last"]}`
        const gender = user["gender"]
        const cellPhone = user["cell"]
        const email = user["email"]
        const age = user["registered"]["age"]
        const imageURL = user["picture"]["medium"]
        const filteredUserData = {name, gender, cellPhone, email, age, imageURL}
        userData.push(filteredUserData)
    });
    renderUserCard(userData)
}

let userData = []

// Cria um elemento HTML contendo as informações geradas pela API
function renderUserCard(userData) {
    userData.forEach(user => {
        const card = document.createElement('div')
        console.log(card)
        card.classList.add('user-card')
        card.innerHTML = `<div class="user-img">
                            <img src="${user.imageURL}" alt="imagem">
                          </div>
                          <div class="user-description">
                            <p class="card-title">${user.name}</p>
                            <p class="subtitle">${user.gender == "male" ? "Masculino" : "Feminino"} - ${user.age} Anos</p>
                            <p class="subtitle">${user.cellPhone}</p>
                            <p class="card-email">${user.email}</p>
                          </div>`
        document.querySelector('.user-list').appendChild(card)
    })
}

loadUserData(26)

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        loadUserData(26)
    }
})

