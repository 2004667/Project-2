// Fetch recipes data from the API
async function getResults(searchTerm = '') {
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=d62cb764100c4afeb7cea18b6d9e785a&query=${searchTerm}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Log the full API response
    
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.slice(0, 20).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        preparationTime: recipe.maxReadyTime
      }));
    } else {
      console.error("No results found or results is not an array");
      return [];
    }

  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

// Display the recipes on the index page
async function getData(searchTerm = '') {
  const recipes = await getResults(searchTerm); 
  const cardContainer = document.getElementById('card-container'); 
  cardContainer.innerHTML = ''; // Clear existing cards
  
  if (recipes && recipes.length > 0) {
    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const titleElement = document.createElement('h3');
      titleElement.textContent = recipe.title;
      
      const imgElement = document.createElement('img');
      imgElement.src = recipe.image; 
      imgElement.alt = recipe.title; 
      imgElement.style.width = '50%'; 
      imgElement.style.height = 'auto'; 
      
      const preptime = document.createElement('p');
      preptime.textContent = `Preparation Time: ${recipe.preparationTime} minutes`;
      
      card.appendChild(titleElement);
      card.appendChild(imgElement);
      card.appendChild(preptime);
      
      cardContainer.appendChild(card);

      // Redirect to the card page with recipe ID on click
      card.addEventListener('click', () => {
        window.location.href = `card.html?id=${recipe.id}`; // Redirect to card.html with recipe ID
      });
    });
  } else {
    cardContainer.innerHTML = "No recipes found."; 
  }
}

getData(); // Fetch and display recipes

// Add search functionality
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (event) => {
const searchTerm = event.target.value.trim();
getData(searchTerm); // Call getData with the search term
});

// Fetch and display recipe details on card.html
async function getRecipeDetails(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=d62cb764100c4afeb7cea18b6d9e785a`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Recipe Details:", data);  // Check if data is being fetched
    return data;
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
  }
}

// Function to display recipe details on card.html
async function displayRecipeDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    console.error("No recipe ID found in URL");
    return;
  }

  const recipeDetails = await getRecipeDetails(recipeId);
  
  if (recipeDetails) {
    const bigPurElement = document.getElementById("bigpur");
    bigPurElement.innerHTML = ` 
      <div>
        <h2>${recipeDetails.title}</h2>
        <img src="${recipeDetails.image}" alt="${recipeDetails.title}" width="100%" style="border-radius: 8px;">
        <p><strong>Preparation Time:</strong> ${recipeDetails.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> ${recipeDetails.servings}</p>

        <h3>Ingredients</h3>
        <ul>
          ${recipeDetails.extendedIngredients.map(ingredient => `
            <li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>
          `).join('')}
        </ul>

        <h3>Cooking Instructions</h3>
        <p>${recipeDetails.instructions}</p>

        <h3>Nutritional Information</h3>
        <ul>
          <li>Calories: ${recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Calories").amount} kcal</li>
          <li>Protein: ${recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Protein").amount} g</li>
          <li>Fat: ${recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Fat").amount} g</li>
          <li>Carbohydrates: ${recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Carbohydrates").amount} g</li>
        </ul>

        <h3>User Ratings</h3>
        <p>Rating: ${recipeDetails.spoonacularScore} / 100</p>
        <p>Number of Reviews: ${recipeDetails.aggregateLikes}</p>
      </div>
    `;
  }
}

// Call the function to display the details when the page loads
if (window.location.pathname.endsWith("card.html")) {
  displayRecipeDetails(); // Only run this on card.html
}
