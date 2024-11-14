const apikey = "e9287b41c5b6dc9a49b961935ac88049";
const apiurl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}`;
let movies = [];
let currentIndex = 0; 
let filteredMovies = []; 

document.addEventListener("DOMContentLoaded", () => {
    getData();
    document.getElementById("next-btn").addEventListener("click", showNext);
    document.getElementById("prev-btn").addEventListener("click", showPrev);
    document.querySelector(".search input").addEventListener("input", filterMoviesByTitle);
});

async function getData() {
    try {
        const response = await fetch(apiurl);
        const data = await response.json();
        movies = data.results;
        filteredMovies = movies; 
        renderMovies(filteredMovies);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

function filterMoviesByTitle(event) {
    const searchQuery = event.target.value.toLowerCase();
    filteredMovies = movies.filter(movie => 
        (movie.title || movie.name).toLowerCase().includes(searchQuery)
    );
    currentIndex = 0; 
    renderMovies(filteredMovies);
}

function renderMovies(movieArray) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = ''; 
    movieArray.slice(currentIndex, currentIndex + 5).forEach(element => {
        const moviecard = createMovieCard(element);
        cardsContainer.appendChild(moviecard);
    });
}

function createMovieCard(element) {
    const { title, name, backdrop_path, vote_average, id } = element;
    const moviecard = document.createElement("div");
    moviecard.classList.add("movie_item");

    const posterUrl = `https://image.tmdb.org/t/p/w500/${backdrop_path}`;
    const imageUnlike = `./images/heart (2).png`;
    const imageLiked = `./images/heart (3).png`;    

    moviecard.innerHTML = `
        <img src="${posterUrl}" class="movie_img-rounded" alt="${title || name}">
        <h3 class="movie-title">${title || name}</h3>
        <p>Rating: ${vote_average} / 10</p>
        <img src="${imageUnlike}" class="movie-switch-img" style="width:23px; height:20px; object-fit:cover" alt="Favorite Icon" data-id="${id}" />
    `;

    const imageElement = moviecard.querySelector(".movie-switch-img");

    imageElement.addEventListener("click", (e) => {
        e.stopPropagation(); 
        const isLiked = imageElement.src.includes("heart (3).png"); 
        imageElement.src = isLiked ? imageUnlike : imageLiked;
        saveToFavorites(element, !isLiked); 
    });

    const titleElement = moviecard.querySelector(".movie-title");
    const mainImageElement = moviecard.querySelector(".movie_img-rounded");

    titleElement.addEventListener("click", () => showMovieDetails(id));
    mainImageElement.addEventListener("click", () => showMovieDetails(id));

    return moviecard;
}



async function showMovieDetails(movieId) {
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apikey}&append_to_response=videos`;
    try {
        const response = await fetch(movieUrl);
        const data = await response.json();
        const { title, overview, vote_average, runtime, videos } = data;

        document.getElementById("movie-title").textContent = title;
        document.getElementById("movie-description").textContent = overview;
        document.getElementById("movie-rating").textContent = vote_average;
        document.getElementById("movie-duration").textContent = runtime;

        const trailerContainer = document.getElementById("movie-trailer");
        trailerContainer.innerHTML = '';
        const trailerKey = videos?.results?.[0]?.key;
        if (trailerKey) {
            trailerContainer.innerHTML = `
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }

        document.getElementById("movie-modal").style.display = "flex";
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

function showNext() {
    if (currentIndex + 5 < filteredMovies.length) {
        currentIndex += 5;
        renderMovies(filteredMovies);
    }
}

function showPrev() {
    if (currentIndex - 5 >= 0) {
        currentIndex -= 5;
        renderMovies(filteredMovies);
    }
}

function saveToFavorites(movie, isLiked) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isLiked) {
        if (!favorites.some(fav => fav.id === movie.id)) {
            favorites.push({
                id: movie.id,
                title: movie.title || movie.name,
                poster_path: movie.backdrop_path,
                vote_average: movie.vote_average
            });
            console.log(`Added to favorites: ${movie.title || movie.name}`);
        }
    } else {
        favorites = favorites.filter(fav => fav.id !== movie.id);
        console.log(`Removed from favorites: ${movie.title || movie.name}`);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}


function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}
