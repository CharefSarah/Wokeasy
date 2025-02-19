/* -----------------------------------------------
   GESTION DU THEME (SOMBRE/CLAIR)
-----------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const themeButton = document.getElementById("theme__button");
  const root = document.documentElement;

  // Icônes (facultatives) pour le bouton
  const sunIcon = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="24" height="24"
         viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="1"
         stroke-linecap="round"
         stroke-linejoin="round"
         class="lucide lucide-sun">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `;
  const moonIcon = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="24" height="24"
         viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="1"
         stroke-linecap="round"
         stroke-linejoin="round"
         class="lucide lucide-moon">
      <path d="M12 3a6 6 0 0 0 9 9
               9 9 0 1 1-9-9Z"></path>
    </svg>
  `;

  // Récupérer le thème dans localStorage
  const savedTheme = localStorage.getItem("theme");

  // Si "dark" est enregistré, on applique le thème sombre
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeButton.innerHTML = moonIcon;
  } else {
    // Sinon, thème clair par défaut
    root.setAttribute("data-theme", "light");
    themeButton.innerHTML = sunIcon;
  }

  // Toggle entre clair et sombre au clic
  themeButton.addEventListener("click", function () {
    if (root.getAttribute("data-theme") === "dark") {
      root.setAttribute("data-theme", "light");
      themeButton.innerHTML = sunIcon;
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      themeButton.innerHTML = moonIcon;
      localStorage.setItem("theme", "dark");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");

  // Quand on clique sur l'avatar
  profileButton.addEventListener("click", function () {
    // Toggle la classe .profile__dropdown--visible
    profileDropdown.classList.toggle("profile__dropdown--visible");
  });

  // Fermer le menu si on clique ailleurs
  document.addEventListener("click", function (event) {
    // Si le clic n'est pas dans le bouton ni dans le dropdown
    if (
      !profileButton.contains(event.target) &&
      !profileDropdown.contains(event.target)
    ) {
      profileDropdown.classList.remove("profile__dropdown--visible");
    }
  });
});
