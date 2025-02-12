const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=152";
const parkingdiv = document.getElementById("pokedex");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let allPokemons = [];

searchButton.addEventListener("click", function() {
    const searchTerm = searchInput.value.toLowerCase();
    filterPokemons(searchTerm);
});

async function getData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("HTTP error");
        }
        const data = await response.json();
        allPokemons = data.results;
        displayData(allPokemons); 
    } catch (error) {
        console.error("Something went wrong with loading the data!", error);
        document.getElementById("pokedex").innerHTML = `<p style="color:red;">We got problems... come back later.</p>`;
    }
}

function filterPokemons(searchTerm) {
    let filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    displayData(filteredPokemons);
}

async function fetchDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("HTTP ERROR " + response.status);
        }
        return await response.json();
    } catch (error) {
        console.error("Error while loading details:", error);
        return null;
    }
}

async function displayData(pokemonList) {
    parkingdiv.innerHTML = "";
    for (const poke of pokemonList) {
        const { name, url } = poke;

        const details = await fetchDetails(url);
        if (!details) continue;

        const weight = details.weight;
        const height = details.height;
        const cry = details.cries?.latest || details.cries?.legacy || "";
        const image = details.sprites?.front_default || "";

        const element = document.createElement("div");
        element.classList.add("pokemon-card");

        parkingdiv.appendChild(element);
        element.innerHTML = `
        <h2>${name}</h2>
        <p>Weight: ${weight} kg</p>
        <p>Height: ${height} m</p>
        ${image ? `<img src="${image}" alt="${name}" />` : "<p>No image available.</p>"}
        ${cry ? `<button onclick="playCry('${cry}')">Play Cry</button>` : "<p>No cry available.</p>"}
        `;
    }
}

function playCry(audios) {
    const audio = new Audio(audios);
    audio.play();
}

getData();
