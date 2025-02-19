document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = "https://CharefSarah.github.io/Wokeasy/data.json";

  // 🔹 Liste des projets existants (que tu avais déjà)
  const projectsData = [
    {
      name: "Sweetgreen",
      category: "App",
      colors: ["Green", "Beige"],
      styles: ["Minimal", "Modern"],
      bookmarkLink: "https://www.wearecollins.com/work/sweetgreen/",
      logo: "assets/images/sweetgreen.png",
      image: null,
      video: "assets/images/8aacfb61-f5af-4f1f-b4d3-fda769dbdc3e.mp4",
    },
    {
      name: "Ronas IT | UI/UX Team",
      category: "Web",
      colors: ["Green, White"],
      styles: ["Clean"],
      bookmarkLink:
        "https://dribbble.com/shots/25605816-E-commerce-Website-Design-Concept?ref=designerdailyreport.com",
      logo: "assets/images/ronas.webp",
      image: "assets/images/s.webp",
      video: null,
    },
    {
      name: "Jones Knowles Ritchie",
      category: "Design",
      colors: ["Blue", "Red"],
      styles: ["Minimal"],
      bookmarkLink: "https://www.jkrglobal.com/work/centersquare",
      logo: "assets/images/wallmart.svg",
      image: null,
      video: "assets/images/walmart.mp4",
    },
  ];

  let allProjects = [...projectsData]; // 🔹 Fusion des projets locaux

  // 🔹 Récupérer les projets du JSON GitHub (mise à jour auto)
  async function fetchExternalProjects() {
    try {
      const response = await fetch(jsonUrl);
      const data = await response.json();
      allProjects = [...projectsData, ...data.projects]; // 🔥 Fusionne les données
      renderGrid(); // 🔹 Met à jour la grille
    } catch (error) {
      console.error("Erreur de chargement du JSON :", error);
    }
  }

  // 🔹 Fonction pour afficher Grid.js
  function renderGrid() {
    const gridContainer = document.getElementById("galleryContainer");
    gridContainer.innerHTML = ""; // Nettoyage avant affichage

    // 🔹 Convertir les projets en format Grid.js
    const gridData = allProjects.map((proj) => [
      proj.name || "Projet sans titre",
      proj.category || "null",
      proj.colors?.length > 0 ? proj.colors.join(", ") : "null",
      proj.styles?.length > 0 ? proj.styles.join(", ") : "null",
      proj.bookmarkLink
        ? gridjs.html(`<a href="${proj.bookmarkLink}" target="_blank">Voir</a>`)
        : "null",
    ]);

    // 🔥 Initialisation de Grid.js
    new gridjs.Grid({
      columns: ["Titre", "Catégorie", "Couleurs", "Styles", "Lien"],
      data: gridData,
      pagination: { limit: 10 },
      search: true,
      sort: true,
      language: {
        search: { placeholder: "Rechercher..." },
        pagination: {
          previous: "Précédent",
          next: "Suivant",
          showing: "Affichage",
          of: "sur",
          to: "à",
          results: "résultats",
        },
      },
    }).render(gridContainer);
  }

  fetchExternalProjects(); // 🔹 Charge les projets au démarrage
});
