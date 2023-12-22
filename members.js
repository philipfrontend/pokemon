document.addEventListener("DOMContentLoaded", () => {
  const teamId = new URLSearchParams(window.location.search).get("id");

  addMembersToHTML(teamId);
});
const listWrapper = document.querySelector(".list-wrapper");
const addMembersToHTML = (id) => {
  let teams = localStorage.getItem("TEAMS");
  let teamsList = JSON.parse(teams);
  teamsList.map((item,index)=>{item.id=index+1})
  console.log(teamsList);
  let members = teamsList.filter((item) => {
    return item.id == id;
  });
  console.log(members);
  console.log(members[0].members);
  listWrapper.innerHTML = "";
  members[0].members.forEach((pokemon) => {
    const pokemonID = pokemon.pokemonId;
    const listItem = document.createElement("div");
    listItem.dataset.id = pokemonID;
    listItem.dataset.name = pokemon.name;
    listItem.dataset.image = pokemon.name;
    listItem.className = "list-item2";
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
    `;

    listItem.addEventListener("click", async (e) => {
      let positionClick = e.target;
      if (positionClick.classList.contains("addPokemon")) {
        let pokemonId = positionClick.parentElement.dataset.id;
        let name = positionClick.parentElement.dataset.name;
        // alert(pokemonId);
        addPokemon(pokemonId, name);
      } else {
          window.location.href = `./detail.html?id=${pokemonID}`;
        }
    });

    listWrapper.appendChild(listItem);
  });
};