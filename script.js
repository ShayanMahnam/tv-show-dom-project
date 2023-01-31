//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  
  displayEpisodesWithSearch(allEpisodes)
}


window.onload = setup;

//assigns variables
const main = document.getElementById("main")
const appHeader = document.getElementById("head-app")
const list = document.createElement("ul");
let count = 0;

const select = document.createElement("select");
const allOption = document.createElement("option");

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search";

function displayEpisodesWithSearch(episodes) {
  // Display dropbox
  displayDropbox(episodes)

  // Display all episodes initially
  displayEpisodes(episodes)
  
  const countSpan = document.createElement("span");
  countSpan.innerHTML = `${count} episode(s) found out of ${episodes.length}`;
  appHeader.appendChild(countSpan);
  
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    list.innerHTML = "";
    count = 0;
    episodes.forEach(function (episode) {
      if (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      ) {
        const episodeCode = `S${("0" + episode.season).slice(-2)}E${("0" + episode.number).slice(-2)}`;
        const item = document.createElement("li");
        const title =  document.createElement("h3")
        const image = document.createElement("img");
        const sum = document.createElement("p")
        image.src = episode.image.medium;
        title.innerText = `${episode.name} - ${episodeCode}`;
        sum.innerHTML = episode.summary; 

        item.appendChild(title)
        item.appendChild(image);
        item.appendChild(sum)
        list.appendChild(item);
        count++;
      }
    });
    countSpan.innerHTML = `${count} episode(s) found out of ${episodes.length}`;
  });
  appHeader.appendChild(select);
  appHeader.appendChild(searchInput);
  appHeader.appendChild(countSpan);
  main.appendChild(list);
}


function displayEpisodes(episodes){
episodes.forEach(function (episode) {
    const episodeCode = `S${("0" + episode.season).slice(-2)}E${("0" + episode.number).slice(-2)}`;
        const item = document.createElement("li");
        const title =  document.createElement("h3")
        const image = document.createElement("img");
        const sum = document.createElement("p")
        image.src = episode.image.medium;
        title.innerText = `${episode.name} - ${episodeCode}`;
        sum.innerHTML = episode.summary; 

        item.appendChild(title)
        item.appendChild(image);
        item.appendChild(sum)
        list.appendChild(item);
        count++;
  });
}

function displayDropbox(episodes){
  
  allOption.value = "all";
  allOption.innerHTML = "All episodes";
  select.appendChild(allOption);

  episodes.forEach(function (episode) {
    const episodeCode = `S${("0" + episode.season).slice(-2)}E${("0" + episode.number).slice(-2)}`;
    const option = document.createElement("option");
    option.value = episode.id;
    option.innerHTML = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    let filteredEpisodes = [];
    if (select.value === "all") {
      filteredEpisodes = episodes;
    } else {
      filteredEpisodes = episodes.filter(ep => select.value.includes(ep.id) );
    }
    count = 0;
    list.innerHTML = "";
    //call back 
    displayEpisodes(filteredEpisodes)

    countSpan.innerHTML = `${count} episode(s) found out of ${episodes.length}`;
  });
}
