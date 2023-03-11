const params = new URLSearchParams(location.search);
const id = params.get('id');

const nome = document.querySelector('[data-name]')
const number = document.querySelector('[data-number]')
const image = document.querySelector('[data-image ]')
const type = document.querySelector('[data-type]')
const weight = document.querySelector('[data-weight]')
const height = document.querySelector('[data-height]')
const abilities = document.querySelector('[data-moves]')
const text = document.querySelector('[data-text]')
const stats = document.querySelector('[data-stats]')

async function renderPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await response.json();

    console.log(pokemonData)

    renderText(pokemonData);

    const body = renderTypeAndColor(pokemonData);
    body.style.backgroundColor = `var(--${pokemonData.types[0].type.name}-color)`;

    renderMoves(pokemonData);
      
      
    renderBasic(pokemonData);
 

}



renderPokemonData(id)

function renderBasic(pokemonData) {
    nome.innerHTML = pokemonData.name;
    number.innerHTML = `#${pokemonData.id}`;
    image.src = pokemonData.sprites.other.dream_world.front_default;
    weight.innerHTML = `${pokemonData.weight / 10} kg`;
    height.innerHTML = `${pokemonData.height / 10} m`;
}

function renderMoves(pokemonData) {
    pokemonData.abilities.forEach(async (ability) => {
        const response = await fetch(ability.ability.url);
        const abilityData = await response.json();
        const li = document.createElement('li');
        li.textContent = abilityData.names.find(name => name.language.name === 'en').name;
        abilities.appendChild(li);
    });

    const span = document.createElement('span');
    span.textContent = 'Moves';
    abilities.appendChild(span);
}

function renderTypeAndColor(pokemonData) {
    const body = document.querySelector('body');

    const typesContainer = document.createElement('div');
    typesContainer.className = 'type';
    typesContainer.setAttribute('data-type', 'type');

    for (const type of pokemonData.types) {
        const typeElement = document.createElement('li');
        typeElement.textContent = type.type.name;
        typeElement.style.backgroundColor = `var(--${type.type.name}-color)`;
        typesContainer.appendChild(typeElement);
    }

    type.appendChild(typesContainer);
    return body;
}

async function renderText(pokemonData) {
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();
    const description = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
    ).flavor_text;
    text.textContent = description;
}
