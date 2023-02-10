// Fetches

async function fetchAllShows() {
  try {
  const response = await fetch (`https://api.tvmaze.com/shows`);
  const data = await response.json();
  
  return data;
        
    } catch (error) {
        return error
    }
}

async function fetchShow(showId){
  const response = await fetch (`https://api.tvmaze.com/shows/${showId}`);
    const data = await response.json();
    return data;
}

async function fetchAllEpisodes(showId) {
   try {
    const response = await fetch (`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    return data;
   } catch (error) {
   return error
   }
    
}

// initial website
async function setup() {
  const allShows= await fetchAllShows();
  showsDisplay(allShows)
}


function createOptionsNewDisplay(shows){
  shows.sort((a,b)=> {
   if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }).forEach(function (show) {
    const option = document.createElement("option");
    option.value = show.id;
    option.innerHTML = `${show.name}`
    dropNewDisplay.appendChild(option);
})
}

function createOptionsShows(shows){
  dropShows.innerHTML = ''
  createAllShowOptionOldDisplay()
  shows.sort((a,b)=> {
   if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }).forEach(function (show) {
    const option = document.createElement("option");
    option.value = show.id;
    option.innerHTML = `${show.name}`
    dropShows.appendChild(option);
})
}
function createAllShowOptionOldDisplay(){
  const option = document.createElement("option")
  option.textContent = "All Shows";
  option.value = "all-shows";
  dropShows.appendChild(option);
}

function createAllShowOption(){
  const option = document.createElement("option")
  option.textContent = "All Shows";
  option.value = "all-shows";
  dropNewDisplay.appendChild(option);
}

function createAllEpisodesOption(){
  const option = document.createElement("option")
  option.textContent = "All Episodes";
  option.value = "all";
  dropEpisodes.appendChild(option);
}

function createOptions(episodes) {
  dropEpisodes.innerHTML = ''
  createAllEpisodesOption()
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

function foundShows(shows){
  const countParagraph = document.getElementById("count-shows")
  countParagraph.innerText = `Found show(s) ${shows.length}`;
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

  dropShows.innerHTML = ''
  createOptionsShows(showsList)
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
  appHeaderNewDisplay.style.display = "none"
  appHeader.style.display = "flex"
  
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

  const select = e.target.value;
  const selectShow = document.getElementById("drop-shows").value
  const episodes = await fetchAllEpisodes(selectShow);
  
  const filteredEpisodes = episodes.filter((episode) => {
    // localeCompare might be neater here
    return (
      select.includes(episode.id) 
    );
  });

   if(select === "all"){
    makePageForEpisodes(episodes)
    searchInput.value = ''
   }
   else{
    makePageForEpisodes(filteredEpisodes)
    searchInput.value = ''
   }
})

const dropShows = document.getElementById("drop-shows")
dropShows.addEventListener('change',async (e) => {
 
  const select = e.target.value;
  
    if(select === 'all-shows'){
      const shows = await fetchAllShows()
      rootElem.innerHTML = "";
      dropEpisodes.innerHTML = "";
      searchInput.value = ''
      createAllEpisodesOption()
      makePageForShows(shows) 
    }
    else{
      const episodes = await fetchAllEpisodes(select);
      dropEpisodes.innerHTML = "";
      searchInput.value = ''
      createAllEpisodesOption()
      createOptions(episodes)
      makePageForEpisodes(episodes)
    }
})

// level 500
// assign variables
const appHeader = document.getElementById("head-app")
const appHeaderNewDisplay = document.getElementById("head-app-shows")
const dropNewDisplay = document.getElementById("shows-search-drop")
const searchNewDisplay = document.getElementById("search-input-shows")

function showsDisplay(showsList){
  rootElem.innerHTML = "";
  appHeader.style.display = "none"
  appHeaderNewDisplay.style.display = "flex"

  dropNewDisplay.innerHTML = ''
  createAllShowOption()
  createOptionsNewDisplay(showsList)
  foundShows(showsList)
  

  showsList.forEach((show) => {
    // add list
    const id = show.id
    const item = document.createElement("li")
    item.classList.add("li-shows")

    item.addEventListener("click", async () =>{
      const episodes = await fetchAllEpisodes(id)
      const shows = await fetchAllShows()
      makePageForEpisodes(episodes)
      createOptions(episodes)
      createOptionsShows(shows)
      
      searchInput.value = ''
      dropShows.value = `${id}`
      countEpisodes(episodes)
      window.scrollTo(0,0)
    })

    // add the season and episode and name
    const paragraph = document.createElement("h3");
    paragraph.textContent = `${show.name}`;
    item.appendChild(paragraph);

    const divDetails = document.createElement("div")
    divDetails.classList.add("picture-details")
    item.appendChild(divDetails)
    // add the image
    const image = document.createElement("img");
    image.classList.add("image-shows")
    image.src = show.image.medium;
    divDetails.appendChild(image);

    // add the summary paragraph nb the episode.summary is actually HTML
    const summary = document.createElement('p')
    summary.classList.add("summary")
    divDetails.appendChild(summary)
    summary.innerHTML += show.summary;

    const divElement = document.createElement('div')
    divElement.classList.add('details')
    divDetails.appendChild(divElement)

    const rated = document.createElement('h5')
    rated.innerHTML= `rated: ${show.rating.average}`
    divElement.appendChild(rated)

    const genres = document.createElement('h5')
    genres.innerHTML = `Genres: ${show.genres}`
    divElement.appendChild(genres)

    const status = document.createElement('h5')
    status.innerHTML = `Status: ${show.status}`
    divElement.appendChild(status)

    const runtime = document.createElement('h5')
    runtime.innerHTML = `Runtime: ${show.runtime}`
    divElement.appendChild(runtime)

    rootElem.appendChild(item)

})
}

function showDisplay(show){
  rootElem.innerHTML = "";
  appHeader.style.display = "none"
  appHeaderNewDisplay.style.display = "flex"

  foundShows([0])

  const id = show.id
    const item = document.createElement("li")
    item.classList.add("li-shows")

    item.addEventListener("click", async () =>{
      const episodes = await fetchAllEpisodes(id)
      const shows = await fetchAllShows()
      makePageForEpisodes(episodes)
      createOptions(episodes)
      createOptionsShows(shows)
      searchInput.value = ''
      dropShows.value = `${id}`
      countEpisodes(episodes)
      window.scrollTo(0,0)
    })

    // add the season and episode and name
    const paragraph = document.createElement("h3");
    paragraph.textContent = `${show.name}`;
    item.appendChild(paragraph);

    const divDetails = document.createElement("div")
    divDetails.classList.add("picture-details")
    item.appendChild(divDetails)
    // add the image
    const image = document.createElement("img");
    image.classList.add("image-shows")
    image.src = show.image.medium;
    divDetails.appendChild(image);

    // add the summary paragraph nb the episode.summary is actually HTML
    const summary = document.createElement('p')
    summary.classList.add("summary")
    divDetails.appendChild(summary)
    summary.innerHTML += show.summary;

    const divElement = document.createElement('div')
    divElement.classList.add('details')
    divDetails.appendChild(divElement)

    const rated = document.createElement('h5')
    rated.innerHTML= `rated: ${show.rating.average}`
    divElement.appendChild(rated)

    const genres = document.createElement('h5')
    genres.innerHTML = `Genres: ${show.genres}`
    divElement.appendChild(genres)

    const status = document.createElement('h5')
    status.innerHTML = `Status: ${show.status}`
    divElement.appendChild(status)

    const runtime = document.createElement('h5')
    runtime.innerHTML = `Runtime: ${show.runtime}`
    divElement.appendChild(runtime)

    rootElem.appendChild(item)


}

const button = document.getElementById("go-back")
button.addEventListener("click",async ()=>{
  const shows = await fetchAllShows()
  dropNewDisplay.value = "all-search-shows"
  searchNewDisplay.value = ''
  dropEpisodes.value = "all"
  showsDisplay(shows)
})

dropNewDisplay.addEventListener('change',async (e) => {
 
  const select = e.target.value;
  
    if(select === 'all-shows'){
      const shows = await fetchAllShows()
      rootElem.innerHTML = "";
      searchInput.value = '';
      createOptionsNewDisplay(shows)
      showsDisplay(shows) 
    }
    else{
      const show = await fetchShow(select);
      searchInput.value = ''
      showDisplay(show)
    }
})

searchNewDisplay.addEventListener("input",async (e)=>{
  const searchTerms = e.target.value.toLowerCase()
  const shows = await fetchAllShows()

  const filteredEpisodes = shows.filter((episode) => {
    // localeCompare might be neater here
    return (
       episode.summary.toLowerCase().includes(searchTerms) ||
      episode.name.toLowerCase().includes(searchTerms)
    );
  });

  dropNewDisplay.innerHTML = ''
  createAllShowOption()
  showsDisplay(filteredEpisodes)

})

window.onload = setup;