document.addEventListener("DOMContentLoaded", function () {
  const recipeList = document.getElementById("recipe-list");
  const categorySelect = document.getElementById("category-select");
  const addRecipeButton = document.getElementById("add-recipe");
  const recipeModal = document.getElementById("recipe-modal");
  const closeButton = document.querySelector(".close");
  const saveRecipeButton = document.getElementById("save-recipe");
  const deleteRecipeButton = document.getElementById("delete-recipe");
  const recipeNameInput = document.getElementById("recipe-name");
  const recipeIngredientsInput = document.getElementById("recipe-ingredients");
  const recipeCategorySelect = document.getElementById("recipe-category");
  const searchInput = document.getElementById("search");

  // Sample data for demonstration
  let myRecipes = [
    {
      name: "Pancakes",
      ingredients: "Flour, eggs, milk",
      category: "Breakfast",
      isFavorite: false,
    },
    {
      name: "Spaghetti Carbonara",
      ingredients: "Pasta, eggs, bacon, cheese",
      category: "Dinner",
      isFavorite: true,
    },
    {
      name: "Chocolate Chip Cookies",
      ingredients: "Flour, sugar, chocolate chips",
      category: "Dessert",
      isFavorite: true,
    },
    {
      name: "Greek Salad",
      ingredients: "Cucumber, tomato, feta cheese",
      category: "Lunch",
      isFavorite: false,
    },
  ];

  // Retrieve the list of favorite recipes from local storage, or default to an empty array if not present
  let favoriteRecipes =
    JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

  // Show the recipe modal
  addRecipeButton.addEventListener("click", function () {
    clearRecipeModal();
    recipeModal.style.display = "block";
  });

  // Close the recipe modal
  closeButton.addEventListener("click", function () {
    clearRecipeModal();
    recipeModal.style.display = "none";
  });

  // Save a new recipe or update an existing one
  saveRecipeButton.addEventListener("click", function () {
    const recipeName = recipeNameInput.value;
    const recipeIngredients = recipeIngredientsInput.value;
    const recipeCategory = recipeCategorySelect.value;

    if (recipeName && recipeIngredients && recipeCategory) {
      const recipe = {
        name: recipeName,
        ingredients: recipeIngredients,
        category: recipeCategory,
      };
      if (selectedRecipeIndex === -1) {
        myRecipes.push(recipe);
      } else {
        myRecipes[selectedRecipeIndex] = recipe;
      }
      clearRecipeModal();
      updateRecipeList();
      recipeModal.style.display = "none";
    } else {
      alert("Please enter a name, ingredients, and category for the recipe.");
    }
    saveToLocalStorage();
  });

  // Delete a recipe
  deleteRecipeButton.addEventListener("click", function () {
    if (selectedRecipeIndex !== -1) {
      myRecipes.splice(selectedRecipeIndex, 1);
      clearRecipeModal();
      updateRecipeList();
      recipeModal.style.display = "none";
    }
  });

  // Clear the recipe modal inputs and buttons
  function clearRecipeModal() {
    recipeNameInput.value = "";
    recipeIngredientsInput.value = "";
    recipeCategorySelect.value = "Breakfast";
    deleteRecipeButton.style.display = "none";
  }

  // Edit a recipe
  let selectedRecipeIndex = -1;
  function editRecipe(index) {
    selectedRecipeIndex = index;
    const selectedRecipe = myRecipes[index];
    recipeNameInput.value = selectedRecipe.name;
    recipeIngredientsInput.value = selectedRecipe.ingredients;
    recipeCategorySelect.value = selectedRecipe.category;
    deleteRecipeButton.style.display = "block";
    saveToLocalStorage();
  }

  // Add a new recipe to the list
  function addRecipeToList(recipe, index) {
    const recipeItem = document.createElement("div");
    recipeItem.className = "recipe";
    recipeItem.id = "recipe${index}";

    const isFavorite = favoriteRecipes.includes(recipe.name);
    const starChar = isFavorite ? "⭐" : "☆";

    recipeItem.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>Ingredients: ${recipe.ingredients}</p>
            <p>Category: ${recipe.category}</p>
            <button  class="edit" id="edit" data-index="${index}">Edit</button>
            <button class="delete" id="delete" data-index="${index}">Delete</button>
            <span class="star-icon" id="star-icon" data-index="${index}">${starChar}</span> 
        `;
    recipeList.appendChild(recipeItem);

    // Handle edit button click
    const editButton = recipeItem.querySelector(".edit");
    editButton.addEventListener("click", function () {
      editRecipe(index);
      recipeModal.style.display = "block";
    });

    // Handle delete button click
    const deleteButton = recipeItem.querySelector(".delete");
    deleteButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this recipe?")) {
        myRecipes.splice(index, 1);
        updateRecipeList();
      }
    });

    const favoriteButton = recipeItem.querySelector(".star-icon");
    favoriteButton.addEventListener("click", function () {
      if (favoriteRecipes.includes(recipe.name)) {
        // If the recipe is already a favorite, remove it from the favorites list
        const idx = favoriteRecipes.indexOf(recipe.name);
        favoriteRecipes.splice(idx, 1);
        favoriteButton.textContent = "☆";
      } else {
        // If the recipe isn't a favorite, add it to the favorites list
        favoriteRecipes.push(recipe.name);
        favoriteButton.textContent = "⭐";
      }
      // Update the favorite recipes list in the localStorage
      localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    });
  }
  //printing the receipe
  const printBtn = document.getElementById("print");
  printBtn.addEventListener("click", function () {
    window.print();
  });
  // Function to update the recipe list
  function updateRecipeList(recipes) {
    recipeList.innerHTML = "";
    const filteredRecipes = recipes || myRecipes;
    filteredRecipes.forEach((recipe, index) => {
      addRecipeToList(recipe, index);
    });
  }

  function toggleFavorite(index, starIcon) {
    myRecipes[index].isFavorite = !myRecipes[index].isFavorite;
    if (myRecipes[index].isFavorite) {
      starIcon.classList.add("favorited");
    } else {
      starIcon.classList.remove("favorited");
    }
  }

  // Event listener for category select
  categorySelect.addEventListener("change", function () {
    const selectedCategory = categorySelect.value;

    // Check if the selected category is "Favourite"
    if (selectedCategory === "Favourite") {
      // Filter recipes to include only Favourite
      const favoriteFilteredRecipes = myRecipes.filter((recipe) =>
        favoriteRecipes.includes(recipe.name)
      );

      // Update the recipe list with Favourite recipes
      updateRecipeList(favoriteFilteredRecipes);
    } else {
      // Check if the selected category is "All"
      const filteredRecipes =
        selectedCategory === "All"
          ? myRecipes
          : myRecipes.filter((recipe) => recipe.category === selectedCategory);

      // Update the recipe list with the filtered recipes
      updateRecipeList(filteredRecipes);
    }
  });

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRecipes = myRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm)
    );
    updateRecipeList(filteredRecipes);
  });

  function saveToLocalStorage() {
    localStorage.setItem("recipes", JSON.stringify(myRecipes));
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes)); // Não esqueça de também salvar os favoritos!
  }

  // Ao carregar a página, verifique se já existem receitas armazenadas no localStorage:
  const storedRecipes = localStorage.getItem("recipes");
  if (storedRecipes) {
    myRecipes = JSON.parse(storedRecipes);
  }
  const storedFavorites = localStorage.getItem("favoriteRecipes");
  if (storedFavorites) {
    favoriteRecipes = JSON.parse(storedFavorites);
  }

  // display of recipes
  updateRecipeList();
});
