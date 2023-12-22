const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
let createTeamBtn = document.querySelector(".createTeamBtn");
let viewTeamsBtn = document.querySelector(".viewTeamsBtn");
let body = document.querySelector("body");
let closeList = document.querySelector(".closeTeam");
let saveList = document.querySelector(".saveTeam");
let listMembersHTML = document.querySelector(".listMembers");
let teamListHTML = document.querySelector(".teamList");
let nameInput = document.querySelector(".teamName");

let allPokemons = [];
let addedPokemons = [];
let teams = [];

createTeamBtn.addEventListener("click", () => {
  if (addedPokemons.length > 0) {
    body.classList.toggle("showList");
  } else {
    alert("No Members First Add Members");
  }
});

viewTeamsBtn.addEventListener("click", () => {
  window.location.href = `./teams.html`;
});

closeList.addEventListener("click", () => {
  body.classList.toggle("showList");
});
saveList.addEventListener("click", () => {
  let value = nameInput.value;
  if (addedPokemons.length > 0) {
    if (value.length > 0) {
      if (addedPokemons.length < 3){
        alert("Please Add atleast 3 Members")
      }
      else{
        let data = {
          members: addedPokemons,
          teamName: value,
        };
  
        //localStorage.clear();
        saveToStorage(data);
      }
      
    } else {
      alert("Please Enter Team Name");
    }
  } else {
    alert("Please Add Pokemons ");
  }
});

const saveToStorage = (x) => {
  let temp = [];
  let data = localStorage.getItem("TEAMS");

  if (data != null) {
    temp = JSON.parse(data);
    temp.push(x);
  } else {
    temp.push(x);
  }

  localStorage.setItem("TEAMS", JSON.stringify(temp));

  let temp2 = [];
  let data2 = localStorage.getItem("TEAMS");
  temp2 = JSON.parse(data2);

  addedPokemons = [];
  nameInput.innerText = "";
  localStorage.removeItem("MEMBERS");
  addListToHTML();
  body.classList.toggle("showList");
  // addTeamToHTML();
};

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    let temp = localStorage.getItem("MEMBERS");
    if (temp != null) {
      addedPokemons = JSON.parse(temp);
    }
    if (addedPokemons.length > 0) {
      createTeamBtn.innerText =
        "Selected Pokemons(" + addedPokemons.length + ")";
      addListToHTML();
    }

    allPokemons = data.results;

    displayPokemons(allPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

function displayPokemons(pokemon) {
  listWrapper.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.dataset.id = pokemonID;
    listItem.dataset.name = pokemon.name;
    listItem.dataset.image = pokemon.name;
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
            
        </div>
        <button class="addPokemon">Add To Team</button>
    `;

    listItem.addEventListener("click", async (e) => {
      let positionClick = e.target;
      if (positionClick.classList.contains("addPokemon")) {
        let pokemonId = positionClick.parentElement.dataset.id;
        let name = positionClick.parentElement.dataset.name;
        // alert(pokemonId);
        addPokemon(pokemonId, name);
      } else {
        const success = await fetchPokemonDataBeforeRedirect(pokemonID);
        if (success) {
          window.location.href = `./detail.html?id=${pokemonID}`;
        }
      }
    });

    listWrapper.appendChild(listItem);
  });
}

const addPokemon = (pokemonId, name) => {
  let positionThisPokemoninList = addedPokemons.findIndex(
    (value) => value.pokemonId == pokemonId
  );
  if (addedPokemons.length <= 0) {
    let resp = window.prompt("Enter your Pokemon nickname")
    console.log(resp)
    addedPokemons = [{ pokemonId: pokemonId, count: 1, name: resp }];
  } else if (positionThisPokemoninList < 0) {
    let resp = window.prompt("Enter your Pokemon nickname")
    addedPokemons.push({
      pokemonId: pokemonId,
      count: 1,
      name: resp,
    });
  }else{
    let resp = window.prompt("Enter your Pokemon nickname")
    addedPokemons.push({
      pokemonId: pokemonId,
      count: 1,
      name: resp,
    });
  }
  //  else {
  //   addedPokemons.push({
  //     pokemonId: pokemonId,
  //     count: 1,
  //     name: name + positionThisPokemoninList,
  //   });
  // }
  localStorage.setItem("MEMBERS", JSON.stringify(addedPokemons));
  addListToHTML();
  console.log(addedPokemons);
};

const addListToHTML = () => {
  listMembersHTML.innerHTML = ``;
  addedPokemons.map((item,index)=>{item.id=index+1})
  if (addedPokemons.length > 0) {
    addedPokemons.forEach((item) => {
      let newList = document.createElement("div");
      newList.classList.add("item");
      newList.innerHTML = `<div class="item">
      <div class="image">
        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${item.pokemonId}.svg" alt="${item.name}" alt="" />
      </div>
      <div class="name">${item.name}</div>
      <div class="id">ID#${item.pokemonId}</div>
      <button class="removeBtn">Remove</button>
    </div>`;
      listMembersHTML.appendChild(newList);
      newList.addEventListener("click", (e) => {
        let position = e.target;
        if (position.classList.contains("removeBtn")) {
          removeMember(item.id);
        }
      });
    });
  }
  createTeamBtn.innerText = "Selected Pokemons(" + addedPokemons.length + ")";
};

const removeMember = (pokemonId) => {
  let newPokemonList = addedPokemons.filter((item) => {
    return item.id != pokemonId;
  });
  let temp = [];
  newPokemonList.map((item) => {
    temp.push(item);
  });
  addedPokemons = temp;
  localStorage.setItem("MEMBERS", JSON.stringify(addedPokemons));
  addListToHTML();
};
searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
