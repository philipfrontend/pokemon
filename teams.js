let teamListHTML = document.querySelector(".teams");
let temp = [];
let data = localStorage.getItem("TEAMS");
let closeList = document.querySelector(".closeTeamBtn");
let selectedId = "";

if (data != null) {
  temp = JSON.parse(data);
  temp.map((item, index) => {
    item.id = index + 1;
  });
}

const addTeamToHTML = () => {
  teamListHTML.innerHTML = ``;
  if (temp.length > 0) {
    temp.forEach((item) => {
      console.log(item);
      const newList = document.createElement("div");
      newList.dataset.id = item.id;

      newList.dataset.teamName = item.teamName;
      newList.dataset.members = item.members;
      //  newList.classList.add("teamItem");
      console.log(newList.dataset);
      newList.className = "list-item1";
      newList.innerHTML = `<div class="number-wrap1">
      <h1 class="caption-fonts2">${item.teamName}</h1>
      <button class="viewMembers">View Members</button>
      <button class="deleteTeam">Delete Team</button></div>`;

      newList.addEventListener("click", async (e) => {
        const positionClick = e.target;
        const teamId = positionClick.closest(".list-item1").dataset.id;
        if (positionClick.classList.contains("deleteTeam")) {
          deleteTeam(teamId);
        } else if (positionClick.classList.contains("viewMembers")) {
          window.location.href = `./members.html?id=${teamId}`;
        }
      });
      teamListHTML.appendChild(newList);
    });
  }
};

const deleteTeam = (id) => {
  let tempData = temp.filter((item) => {
    return item.id != id;
  });
  temp = tempData;
  localStorage.setItem("TEAMS", JSON.stringify(temp));
  addTeamToHTML();
};

addTeamToHTML();
