const params = new URLSearchParams(location.search);
let id = params.get('id');

const nome = document.querySelector('[data-name]')
const number = document.querySelector('[data-number]')
const image = document.querySelector('[data-image ]')
const type = document.querySelector('[data-type]')
const weight = document.querySelector('[data-weight]')
const height = document.querySelector('[data-height]')
const abilities = document.querySelector('[data-moves]')
const text = document.querySelector('[data-text]')
const stats = document.querySelector('[data-stats]')

const prevButton = document.querySelector('.btn-prev');
const nextButton = document.querySelector('.btn-next');

prevButton.addEventListener('click', async () => {
  if (id > 1) {
    id--;
    clearPokemonData();
    try {
      await renderPokemonData(id);
    } catch (error) {
      console.error('Erro ao carregar dados do Pokemon:', error.message);
      alert('Ocorreu um erro ao carregar os dados do Pokemon. Tente novamente mais tarde.');
    }
  }
});

nextButton.addEventListener('click', async () => {
  if (id < 898) {
    id++;
    clearPokemonData();
    try {
      await renderPokemonData(id);
    } catch (error) {
      console.error('Erro ao carregar dados do Pokemon:', error.message);
      alert('Ocorreu um erro ao carregar os dados do Pokemon. Tente novamente mais tarde.');
    }
  }
});

async function renderPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await response.json();

    renderText(pokemonData);

    const body = renderTypeAndColor(pokemonData);
    body.style.backgroundColor = `var(--${pokemonData.types[0].type.name}-color)`;

    renderMoves(pokemonData);
    renderBasic(pokemonData);
    renderStats(pokemonData);
  } catch (error) {
    console.error('Erro ao carregar dados do Pokemon:', error.message);
  }
}

function renderBasic(pokemonData) {
  try {
    nome.innerHTML = pokemonData.name;
    number.innerHTML = `#${pokemonData.id}`;
    image.src = pokemonData.sprites.other.dream_world.front_default;
    weight.innerHTML = `${pokemonData.weight / 10} kg`;
    height.innerHTML = `${pokemonData.height / 10} m`;
  } catch (error) {
    console.error('Erro ao renderizar dados básicos do Pokemon:', error.message);
  }
}

async function renderMoves(pokemonData) {
  try {
    for (const ability of pokemonData.abilities) {
      const response = await fetch(ability.ability.url);
      const abilityData = await response.json();
      const li = document.createElement('li');
      li.textContent = abilityData.names.find(name => name.language.name === 'en').name;
      abilities.appendChild(li);
    }

    const span = document.createElement('span');
    span.textContent = 'Moves';
    abilities.appendChild(span);
  } catch (error) {
    console.error('Erro ao renderizar movimentos do Pokemon:', error.message);
  }
}


 function renderTypeAndColor(pokemonData) {
    const body = document.querySelector('body');

    const typesContainer = document.createElement('div');
    typesContainer.className = 'type';
    typesContainer.setAttribute('data-type', 'type');

    try {
        for (const type of pokemonData.types) {
            const typeElement = document.createElement('li');
            typeElement.textContent = type.type.name;
            typeElement.style.backgroundColor = `var(--${type.type.name}-color)`;
            typesContainer.appendChild(typeElement);
        }

        type.appendChild(typesContainer);
    } catch (error) {
        console.log('Erro ao renderizar tipo e cor do pokémon:', error.message);
    }

    return body;
}

async function renderText(pokemonData) {
    const speciesResponse = await fetch(pokemonData.species.url);

    try {
        const speciesData = await speciesResponse.json();
        const description = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
        ).flavor_text;
        text.textContent = description;
    } catch (error) {
        console.log('Erro ao renderizar descrição do pokémon:', error.message);
    }
}

const statAbbreviations = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SATK',
    'special-defense': 'SDEF',
    'speed': 'SPD'
  };
  
  async function renderStats(pokemonData) {
    try {
      const statsList = pokemonData.stats;
    
      const statsContainer = document.querySelector('.stats-container');
    
      for (let i = 0; i < statsList.length; i++) {
        const statName = statsList[i].stat.name;
        const statValue = statsList[i].base_stat;
    
        const statElement = document.createElement('div');
        statElement.className = 'stat';
    
        const statNameElement = document.createElement('div');
        statNameElement.className = 'stat-name';
        statNameElement.textContent = statAbbreviations[statName] || statName.toUpperCase();
        statElement.appendChild(statNameElement);
    
        const statValueElement = document.createElement('div');
        statValueElement.className = 'stat-value';
        statValueElement.textContent = statValue;
        statElement.appendChild(statValueElement);
    
        const statBarElement = document.createElement('div');
        statBarElement.className = 'stat-bar';
        statBarElement.style.backgroundColor = 'grey';
        statBarElement.style.width = '200%';
        statElement.appendChild(statBarElement);
    
        const statBarValueElement = document.createElement('div');
        statBarValueElement.className = 'stat-bar-value';
        statBarValueElement.style.backgroundColor = `var(--${pokemonData.types[0].type.name}-color)`;
        statBarValueElement.style.width = `calc(${statValue}% - 10%)`;
        statBarElement.appendChild(statBarValueElement);
    
        statsContainer.appendChild(statElement);
      }
    } catch (erro) {
      console.error(`Erro ao renderizar as estatísticas do Pokémon: ${erro.message}`);
    }
  }
  

function loading() {
    const loading = document.getElementById("loading");

    window.addEventListener("load", function () {
        loading.style.display = "none";
    });
}
function clearPokemonData() {
    try {
      nome.textContent = '';
      number.textContent = '';
      image.src = '';
      weight.textContent = '';
      height.textContent = '';
      abilities.textContent = '';
      text.textContent = '';
      type.textContent = '';
      stats.innerHTML = '';
    } catch (erro) {
      console.error(`Erro ao limpar os dados do Pokémon: ${erro.message}`);
    }
  }
  
  
  loading();
  
renderPokemonData(id)
