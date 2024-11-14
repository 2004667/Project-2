const apikey = "e9287b41c5b6dc9a49b961935ac88049";

// Get the movieId from the query string in the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");  // Extract movie id from URL

// Check if the movieId exists
if (movieId) {
    const apiurl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apikey}&append_to_response=videos`;  // Append videos to get the trailer

    document.addEventListener("DOMContentLoaded", () => {
        getMovieDetails();
    });

    async function getMovieDetails() {
        try {
            const response = await fetch(apiurl);
            const data = await response.json();
            
        
            if (data && data.title) {
                const movieDetailsContainer = document.getElementById("movie-details");

                const { title, name, overview, vote_average, poster_path, videos } = data;
                
                
                movieDetailsContainer.innerHTML = `
                    <h1>${title || name}</h1>
                    <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title || name}">
                    <p><strong>Rating:</strong> ${vote_average} / 10</p>
                    <p><strong>Overview:</strong> ${overview}</p>
                    <h3>Trailer:</h3>
                    ${videos && videos.results.length > 0 ? 
                        `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videos.results[0].key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` 
                        : `<p>No trailer available.</p>`
                    }
                `;
            } else {
                console.error("Error: Movie details not found.");
                document.getElementById("movie-details").innerHTML = `<p>Movie details not available.</p>`;
            }
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
            document.getElementById("movie-details").innerHTML = `<p>Failed to load movie details. Please try again later.</p>`;
        }
    }
} else {
    console.error("Error: Movie ID not found in the URL.");
    document.getElementById("movie-details").innerHTML = `<p>Movie ID is missing or invalid in the URL.</p>`;
}
