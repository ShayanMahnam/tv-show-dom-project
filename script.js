async function fetchAllShows() {
  try {
  const response = await fetch (`https://api.tvmaze.com/shows`);
  const data = await response.json();
  console.log(data);
  return data;
        
    } catch (error) {
        return error
    }
}

async function fetchAllEpisodes(showId) {
   
    const response = await fetch (`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    return data;
}


async function setup() {
  const allShows= await fetchAllShows();
  createOptionsShows(allShows)
  countShows(allShows)
  makePageForShows(allShows)
}

function createOptionsShows(shows){
  shows.forEach(function (show) {
    const option = document.createElement("option");
    option.value = show.id;
    option.innerHTML = `${show.name}`
    dropShows.appendChild(option);
})
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

async function countShows(shows){
  const allShows = await fetchAllShows()
  const countParagraph = document.getElementById("count-episodes")
  countParagraph.innerText = `Displaying show(s) ${shows.length}/${allShows.length}`;
}

async function countEpisodes(episodes){
  const select = document.getElementById("drop-shows").value
  const episodesSelectedShow = await fetchAllEpisodes(select);

  const countParagraph = document.getElementById("count-episodes")
  countParagraph.innerText = `Displaying episode(s) ${episodes.length}/${episodesSelectedShow.length}`;
}

function makePageForShows(showsList){
  rootElem.innerHTML = "";

  countShows(showsList)

  showsList.forEach((show) => {
    // add list
    const item = document.createElement("li")

    // add the season and episode and name
    const paragraph = document.createElement("h3");
    paragraph.textContent = `${show.name}`;
    item.appendChild(paragraph);

    // add the image
    const image = document.createElement("img");
    image.src = show.image.medium;
    item.appendChild(image);

    // add the summary paragraph nb the episode.summary is actually HTML
    const summary = document.createElement('p')
    item.appendChild(summary)
    summary.innerHTML += show.summary;
    rootElem.appendChild(item)

})
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
searchInput.addEventListener("input", async (e) => {
  const select = document.getElementById("drop-shows").value

  if(select === 'all-shows'){
    const shows = await fetchAllShows()
    const searchTerms = e.target.value.toLowerCase();

    const filteredEpisodes = shows.filter((episode) => {
    // localeCompare might be neater here
    return (
      episode.summary.toLowerCase().includes(searchTerms) ||
      episode.name.toLowerCase().includes(searchTerms)
    );
  });
  makePageForShows(filteredEpisodes);
  }
  else{
    const episodes = await fetchAllEpisodes(select);

  const searchTerms = e.target.value.toLowerCase();
  const filteredEpisodes = episodes.filter((episode) => {
    // localeCompare might be neater here
    return (
      episode.summary.toLowerCase().includes(searchTerms) ||
      episode.name.toLowerCase().includes(searchTerms)
    );
  });
  makePageForEpisodes(filteredEpisodes);
  }
  
});

const dropEpisodes = document.getElementById("drop-episodes")
dropEpisodes.addEventListener("change",async (e) =>{
  const selectShow = document.getElementById("drop-shows").value
  const episodes = await fetchAllEpisodes(selectShow);
  const select = e.target.value;
  const filteredEpisodes = episodes.filter((episode) => {
    // localeCompare might be neater here
    return (
      select.includes(episode.id) 
    );
  });
   select === "all" ? makePageForEpisodes(episodes) : makePageForEpisodes(filteredEpisodes)
})

const dropShows = document.getElementById("drop-shows")
dropShows.addEventListener('change',async (e) => {
 
  const select = e.target.value;
  const shows = await fetchAllShows()
  const episodes = await fetchAllEpisodes(select);
  
  
    if(select === 'all-shows'){
      rootElem.innerHTML = "";
      makePageForShows(shows) 
    }
    else{
      createOptions(episodes)
      makePageForEpisodes(episodes)
    }
})

window.onload = setup;