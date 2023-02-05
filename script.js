//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  createOptions(allEpisodes)
  makePageForEpisodes(allEpisodes);
}

function createOptions(episodes) {
  episodes.forEach(function (episode) {
    const option = document.createElement("option");
    option.value = episode.id;
    option.innerHTML = `${makeSeasonAndEpisode(episode)} - ${episode.name}`
    dropEpisodes.appendChild(option);
  });
}

function makeSeasonAndEpisode(episode) {
  const { season, number } = episode;
  const paddedSeason = season.toString().padStart(2, "0");
  const paddedEpisode = number.toString().padStart(2, "0");

  return `S${paddedSeason}E${paddedEpisode}`;
}

function countEpisodes(episodes){
  const countParagraph = document.getElementById("count-episodes")
  countParagraph.innerText = `Displaying episode(s) ${episodes.length}/${getAllEpisodes().length}`;
}

const rootElem = document.getElementById("root");
function makePageForEpisodes(episodeList) {
  
  // clear out the rootElement's HTML before we add the new stuff
  rootElem.innerHTML = "";
  
  countEpisodes(episodeList)

  episodeList.forEach((episode) => {
    // add list
    const item = document.createElement("li")

    // add the season and episode and name
    const paragraph = document.createElement("h3");
    paragraph.textContent = `${episode.name} - ${makeSeasonAndEpisode(episode)}`;
    item.appendChild(paragraph);

    // add the image
    const image = document.createElement("img");
    image.src = episode.image.medium;
    item.appendChild(image);

    // add the summary paragraph nb the episode.summary is actually HTML
    item.innerHTML += episode.summary;
    rootElem.appendChild(item)
  });
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  const searchTerms = e.target.value.toLowerCase();
  const filteredEpisodes = getAllEpisodes().filter((episode) => {
    // localeCompare might be neater here
    return (
      episode.summary.toLowerCase().includes(searchTerms) ||
      episode.name.toLowerCase().includes(searchTerms)
    );
  });
  makePageForEpisodes(filteredEpisodes);
});

const dropEpisodes = document.getElementById("drop-episodes")
dropEpisodes.addEventListener("change",(e) =>{
  const select = e.target.value;
  const filteredEpisodes = getAllEpisodes().filter((episode) => {
    // localeCompare might be neater here
    return (
      select.includes(episode.id) 
    );
  });
   select === "all" ? makePageForEpisodes(getAllEpisodes()) : makePageForEpisodes(filteredEpisodes)
})

window.onload = setup;
