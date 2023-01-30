//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  
  displayEpisodesWithSearch(allEpisodes)
}


window.onload = setup;


const main = document.getElementById("main")
const appHeader = document.getElementById("head-app")

function displayEpisodesWithSearch(episodes) {
  const list = document.createElement("ul");
  let count = 0;
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search";

  const select = document.createElement("select");
  const allOption = document.createElement("option");
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
      filteredEpisodes = episodes.filter(ep => ep.id === select.value);
    }
    count = 0;
    list.innerHTML = "";
    filteredEpisodes.forEach(function (episode) {
      const episodeCode = `S${("0" + episode.season).slice(-2)}E${("0" + episode.number).slice(-2)}`;
      const item = document.createElement("li");
      const image = document.createElement("img");
      image.src = episode.image.medium;
      item.innerHTML = `${episode.name} - `;
      item.innerHTML += `${episodeCode}<br>`;
      item.appendChild(image);
      item.innerHTML += `${episode.summary}`;
      list.appendChild(item);
      count++;
    });
    countSpan.innerHTML = `${count} episode(s) found out of 73`;
  });


  // Display all episodes initially
  episodes.forEach(function (episode) {
    const episodeCode = `S${("0" + episode.season).slice(-2)}E${("0" + episode.number).slice(-2)}`;
        const item = document.createElement("li");
        const image = document.createElement("img");
        image.src = episode.image.medium;
        item.innerHTML = `${episode.name} - `;
        item.innerHTML += `${episodeCode}<br>`;
        item.appendChild(image);
        item.innerHTML += `${episode.summary}`;
        list.appendChild(item);
        count++;
  });
  
  const countSpan = document.createElement("span");
  countSpan.innerHTML = `${count} episode(s) found out of 73`;
  main.appendChild(countSpan);
  
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
        const image = document.createElement("img");
        image.src = episode.image.medium;
        item.innerHTML = `${episode.name} - `;
        item.innerHTML += `${episodeCode}<br>`;
        
        item.appendChild(image);
        item.innerHTML += `${episode.summary}`;
        list.appendChild(item);
        count++;
      }
    });
    countSpan.innerHTML = `${count} episode(s) found out of 73`;
  });
  appHeader.appendChild(select);
  appHeader.appendChild(searchInput);
  appHeader.appendChild(countSpan);
  main.appendChild(list);
}

