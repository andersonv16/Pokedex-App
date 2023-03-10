const containerPokemon = document.querySelector("[data-container]");
const pageNumber = document.querySelector("[data-pageNumber]");
const sortButton = document.getElementById("sortButton");
const previousButton = document.querySelector("[data-previous]");
const nextButton = document.querySelector("[data-next]");
const form = document.querySelector("[data-pesquisa]");

let sortType = "numeric";
let pageindex = 1;


previousButton.addEventListener("click", () => {
    if (pageindex > 1) {
      pageindex--;
      getPokemon(pageindex);
    }
  });
  
  nextButton.addEventListener("click", () => {
    pageindex++;
    getPokemon(pageindex);
  });
  
  sortButton.addEventListener("click", () => {
    const pokemonCards = document.querySelectorAll(".container-pokemon");
    const pokemonCardsArray = Array.from(pokemonCards);
  
    if (sortType === "numeric") {
      sortButton.innerHTML = "A";
      pokemonCardsArray.sort((a, b) => {
        const pokemonNameA = a
          .querySelector("[data-name]")
          .textContent.toLowerCase();
        const pokemonNameB = b
          .querySelector("[data-name]")
          .textContent.toLowerCase();
        if (pokemonNameA < pokemonNameB) {
          return -1;
        }
        if (pokemonNameA > pokemonNameB) {
          return 1;
        }
        return 0;
      });
      sortType = "alpha";
    } else {
      sortButton.innerHTML = "#";
      pokemonCardsArray.sort((a, b) => {
        const pokemonNumberA = parseInt(
          a.querySelector("[data-number]").textContent.slice(1)
        );
        const pokemonNumberB = parseInt(
          b.querySelector("[data-number]").textContent.slice(1)
        );
        return pokemonNumberA - pokemonNumberB;
      });
      sortType = "numeric";
    }
  
    pokemonCardsArray.forEach((pokemonCard) => {
      containerPokemon.appendChild(pokemonCard);
    });
  });
  
  form.addEventListener('focusout', async (event) =>{
      event.preventDefault()
      createdEvent()
  })
  
  form.addEventListener('submit', async (event) =>{
      event.preventDefault()
      createdEvent()
     
  })
  

async function getPokemon(pageindex) {
  containerPokemon.innerHTML = "";

  for (let i = (pageindex - 1) * 9 + 1; i <= pageindex * 9; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const pokemon = await response.json();
    pageNumber.innerHTML = `Página ${pageindex}`;
    createCard(i, pokemon.sprites.other, pokemon.name,)
  }
}



function createCard(indice, sprites, pokemonName){
    const pokemonCard = document.createElement("div");

    pokemonCard.classList.add("container-pokemon");
    pokemonCard.innerHTML = `
        <p class="pokemon-number" data-number>#${indice}</p>
        <img class="pokemon-image" data-image src="${sprites["official-artwork"].front_default}" width="90px" alt="Imagem do Pokemon ${pokemonName}">
        <p class="nome-pokemon" data-name>${pokemonName}</p>
      `;

    containerPokemon.appendChild(pokemonCard);
}

async function createdEvent () {
    const input = document.querySelector('[data-input]')
    if(input.value == '') {
      location.reload()
    } else {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input.value.toLowerCase()}`);
      if(response.status == '200') {
        const pokemon = await response.json();
        containerPokemon.innerHTML = "";
        createCard(pokemon.id, pokemon.sprites.other, pokemon.name,)
      } else {
        containerPokemon.innerHTML = "";
        const warningMessage = document.createElement("p");
        warningMessage.classList.add("warning");
        warningMessage.innerText = "Não encontrado.";
        containerPokemon.appendChild(warningMessage);
      }
      input.value = '';
    }
  }
  getPokemon(pageindex);