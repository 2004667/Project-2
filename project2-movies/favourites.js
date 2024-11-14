document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
    document.getElementById("clear-favorites").addEventListener("click", clearFavorites);
});

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesContainer = document.getElementById("favorites-container");

    if (favorites.length > 0) {
        favorites.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie_item"); 
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="movie_img-rounded" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average} / 10</p>
                <img src="./images/heart (3).png" class="movie-switch-img" style="width:23px; height:20px; object-fit:cover" alt="Unlike" data-id="${movie.id}" />
            `;

            const unlikeImage = movieCard.querySelector(".movie-switch-img");
            unlikeImage.addEventListener("click", () => {
                removeFromFavorites(movie.id);
                movieCard.remove();
            });

            favoritesContainer.appendChild(movieCard);
        });
    } else {
        favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
    }
}

function removeFromFavorites(movieId) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

function clearFavorites() {
    localStorage.removeItem("favorites"); 
    alert("Favorites cleared!");
    location.reload(); 
}
