/* -----------------------------------------------
   GESTION DES SUGGESTIONS INPUT "/"
-----------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search__input");
  const searchSuggestions = document.getElementById("search__suggestions");

  const suggestions = [
    "Figma",
    "Adobe XD",
    "Sketch",
    "React",
    "Vue.js",
    "Svelte",
  ];
  let filteredSuggestions = [];
  let selectedIndex = -1;

  // Fonction pour afficher/masquer les suggestions
  function showSuggestions(query) {
    searchSuggestions.innerHTML = "";
    selectedIndex = -1;

    if (!query) {
      filteredSuggestions = suggestions;
    } else {
      filteredSuggestions = suggestions
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          return (
            a.toLowerCase().indexOf(query.toLowerCase()) -
            b.toLowerCase().indexOf(query.toLowerCase())
          );
        });
    }

    if (filteredSuggestions.length === 0) {
      searchSuggestions.style.display = "none";
      return;
    }

    filteredSuggestions.forEach((item, index) => {
      const suggestionElement = document.createElement("div");
      suggestionElement.classList.add("search__suggestion");
      suggestionElement.textContent = item;
      suggestionElement.dataset.index = index;

      suggestionElement.addEventListener("click", () => {
        selectSuggestion(index);
      });

      searchSuggestions.appendChild(suggestionElement);
    });

    searchSuggestions.style.display = "block";
  }

  // Sélection d'une suggestion
  function selectSuggestion(index) {
    searchInput.value = filteredSuggestions[index];
    searchSuggestions.style.display = "none";
  }

  // Mise à jour de la sélection visuelle
  function updateSelection() {
    const items = document.querySelectorAll(".search__suggestion");
    items.forEach((item) => item.classList.remove("selected"));

    if (selectedIndex !== -1) {
      items[selectedIndex].classList.add("selected");
      searchInput.value = filteredSuggestions[selectedIndex];
    }
  }

  // Écoute de la saisie
  searchInput.addEventListener("input", function () {
    let query = this.value.trim();
    if (query.startsWith("/")) {
      query = query.substring(1);
      showSuggestions(query);
    } else {
      searchSuggestions.style.display = "none";
    }
  });

  // Gestion des flèches (up/down), entrée, échappe
  searchInput.addEventListener("keydown", function (event) {
    const items = document.querySelectorAll(".search__suggestion");
    if (filteredSuggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredSuggestions.length;
      updateSelection();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex =
        (selectedIndex - 1 + filteredSuggestions.length) %
        filteredSuggestions.length;
      updateSelection();
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      event.preventDefault();
      selectSuggestion(selectedIndex);
    } else if (event.key === "Escape") {
      searchSuggestions.style.display = "none";
    }
  });

  // Gestion du raccourci "/" global
  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
      searchInput.value = "/";
      showSuggestions("");
    }
  });

  // Clic hors zone => on masque les suggestions
  document.addEventListener("click", function (event) {
    if (
      !searchInput.contains(event.target) &&
      !searchSuggestions.contains(event.target)
    ) {
      searchSuggestions.style.display = "none";
    }
  });
});

/* -----------------------------------------------
   GESTION DE LA MODALE (Ctrl + K + clic trigger)
-----------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("searchModal");
  const modalOverlay = document.querySelector(".modal__overlay");
  const modalInput = document.getElementById("modalSearchInput");
  const modalSuggestions = document.getElementById("modalSuggestions");
  const modalClose = document.getElementById("modalClose");
  // On cible le bouton (ou span) pour ouvrir la modale :
  const searchTrigger = document.querySelector(".search__trigger");

  let selectedIndex = -1;

  // Données de la modale avec SVG inline
  const suggestionData = [
    {
      category: "Links",
      items: [
        {
          name: "Figma",
          icon: `<svg xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      stroke-width="1" stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-figma">
                    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5
                             A3.5 3.5 0 0 1 5 5.5z"/>
                    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/>
                    <path d="M12 12.5a3.5 3.5 0 1 1 7 0
                             3.5 3.5 0 1 1-7 0z"/>
                    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5
                             a3.5 3.5 0 1 1-7 0z"/>
                    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7
                             H8.5A3.5 3.5 0 0 1 5 12.5z"/>
                 </svg>`,
        },
        {
          name: "Dribbble",
          icon: `<svg xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      stroke-width="1" stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-dribbble">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                 </svg>`,
        },
        {
          name: "Framer",
          icon: `<svg xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      stroke-width="1" stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-framer">
                    <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7"></path>
                 </svg>`,
        },
      ],
    },
    {
      category: "Getting Started",
      items: [
        {
          name: "Installation",
          icon: `<svg xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      stroke-width="1" stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-frame">
                    <line x1="22" x2="2" y1="6" y2="6"></line>
                    <line x1="22" x2="2" y1="18" y2="18"></line>
                    <line x1="6" x2="6" y1="2" y2="22"></line>
                    <line x1="18" x2="18" y1="2" y2="22"></line>
                 </svg>`,
          description: "Learn how to install and configure Nuxt UI.",
        },
        {
          name: "Installation",
          icon: `<svg xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      stroke-width="1" stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-component">
                    <path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377
                             a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414
                             l-2.377-2.377a1 1 0 0 0-1.414 0z"/>
                    <path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377
                             a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414
                             L6.088 8.916a1 1 0 0 0-1.414 0z"/>
                    <path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376
                             a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415
                             l-2.377-2.376a1 1 0 0 0-1.414 0z"/>
                    <path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376
                             a1 1 0 0 0 1.414 0l2.377-2.376
                             a1 1 0 0 0 0-1.414l-2.377-2.377
                             a1 1 0 0 0-1.414 0z"/>
                 </svg>`,
          description: "Learn how to install and configure Nuxt UI.",
        },
      ],
    },
  ];

  // Fonction pour afficher la modale
  function showModal() {
    modal.style.display = "flex";
    modalInput.focus();
    renderSuggestions(""); // Si tu veux afficher qqch par défaut
  }

  // Fonction pour fermer la modale
  function closeModal() {
    modal.style.display = "none";
    modalInput.value = "";
    modalSuggestions.innerHTML = "";
    selectedIndex = -1;
  }

  // Rendu des suggestions dans la modale
  function renderSuggestions(query) {
    modalSuggestions.innerHTML = "";
    selectedIndex = -1;

    suggestionData.forEach((group) => {
      // Filtrer par nom
      const matchingItems = group.items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingItems.length > 0) {
        // Titre du groupe
        const groupElement = document.createElement("div");
        groupElement.classList.add("suggestion__group");
        groupElement.textContent = group.category;
        modalSuggestions.appendChild(groupElement);

        // Items
        matchingItems.forEach((item, index) => {
          const itemElement = document.createElement("div");
          itemElement.classList.add("suggestion__item");
          itemElement.dataset.index = index;

          const iconElement = document.createElement("span");
          iconElement.classList.add("suggestion__icon");
          iconElement.innerHTML = item.icon; // SVG inline

          const nameElement = document.createElement("span");
          nameElement.textContent = item.name;

          itemElement.appendChild(iconElement);
          itemElement.appendChild(nameElement);

          if (item.description) {
            const descriptionElement = document.createElement("small");
            descriptionElement.textContent = ` - ${item.description}`;
            itemElement.appendChild(descriptionElement);
          }

          itemElement.addEventListener("click", () => {
            modalInput.value = item.name;
            closeModal();
          });

          modalSuggestions.appendChild(itemElement);
        });
      }
    });
  }

  // Ouvrir la modale au clic sur .search__trigger
  searchTrigger.addEventListener("click", function () {
    showModal();
  });

  // Gestion de "Ctrl + K" pour ouvrir la modale
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      showModal();
    }
  });

  // Navigation clavier dans l'input de la modale
  modalInput.addEventListener("input", function () {
    renderSuggestions(this.value.trim());
  });
  modalInput.addEventListener("keydown", function (event) {
    const items = document.querySelectorAll(".suggestion__item");
    if (items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      modalInput.value = items[selectedIndex].textContent.trim();
      closeModal();
    } else if (event.key === "Escape") {
      closeModal();
    }

    // Mise à jour de la classe "selected"
    items.forEach((item) => item.classList.remove("selected"));
    if (selectedIndex !== -1) {
      items[selectedIndex].classList.add("selected");
    }
  });

  // Fermeture via le bouton "✖" ou en cliquant sur l’overlay
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Fermeture globale au clavier (Escape)
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});

/****************************************************
 *                DONNÉES D'EXEMPLE
 ****************************************************/
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
  {
    name: "Dash Digital",
    category: "Design",
    colors: ["Blue", "beige", "red"],
    styles: ["Bold"],
    bookmarkLink: "https://dashdigital.studio/case-studies/enpower",
    logo: "assets/images/dashdigitalogo.jpg",
    image: "assets/images/dashdigital.jpg",
    video: null,
  },
  {
    name: "Landing Design",
    category: "Design",
    colors: ["Yellow"],
    styles: ["Retro", "Minimal"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Endel",
    category: "App",
    colors: ["Black"],
    styles: ["Modern"],
    bookmarkLink: "https://dribbble.com/shots/16695211-Endel",
    logo: "assets/images/endelogo.png",
    image: "assets/images/endel.png",
    video: null,
  },
  {
    name: "Branding Concepts",
    category: "Web", // On teste en minuscule
    colors: ["Red", "Black"],
    styles: ["Bold"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Cuberto",
    category: "Web",
    colors: ["Blue"],
    styles: ["Minimal", "Modern"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Portfolio Web",
    category: "Web",
    colors: ["Blue"],
    styles: ["Clean"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: null,
    video: "assets/images/combo.mp4",
  },
  {
    name: "UI Kit",
    category: "UI Elements",
    colors: ["Green", "Red"],
    styles: ["Minimal"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Motion Demo",
    category: "Animations",
    colors: ["Purple"],
    styles: ["Bold"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Landing Design",
    category: "Design",
    colors: ["Yellow"],
    styles: ["Retro", "Minimal"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
  {
    name: "Flor & Fjære",
    category: "Design",
    colors: ["Green", "Yellow"],
    styles: ["Modern"],
    bookmarkLink: "https://oker.com/projects/flor-fjaere/",
    logo: "assets/images/logooker.jpg",
    image: "assets/images/okerprojet.jpg",
    video: null,
  },
  {
    name: "Branding Concepts",
    category: "Web", // On teste en minuscule
    colors: ["Red", "Black"],
    styles: ["Bold"],
    bookmarkLink: "#",
    logo: "assets/images/apple-icon.png",
    image: "assets/images/original-0375602e302703ef3eba39a6c2e4ab43.webp",
    video: null,
  },
];

/****************************************************
 *               ÉLÉMENTS DU DOM
 ****************************************************/
const categoryFiltersContainer = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const galleryContainer = document.getElementById("galleryContainer");

/****************************************************
 *        LISTE DES CATÉGORIES (pour les boutons)
 ****************************************************/
const categories = [
  "All",
  ...new Set(projectsData.map((item) => item.category)),
];

/****************************************************
 *           CRÉATION DES BOUTONS DE CATÉGORIE
 ****************************************************/
let activeCategory = "All"; // Par défaut

categories.forEach((cat) => {
  // Compter combien d’items appartiennent à `cat`
  const count =
    cat === "All"
      ? projectsData.length
      : projectsData.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ).length;

  const btn = document.createElement("button");
  btn.className = "filter-btn";
  btn.textContent = cat;

  // Nombre entre parenthèses
  const spanCount = document.createElement("span");
  spanCount.textContent = `(${count})`;
  btn.appendChild(spanCount);

  // Au clic : on change la catégorie active et on re‐rend la galerie
  btn.addEventListener("click", () => {
    // Désactiver tous les boutons
    categoryFiltersContainer
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    // Activer celui‐ci
    btn.classList.add("active");
    activeCategory = cat;
    renderCards();
  });

  // On insère le bouton dans la zone de filtres
  categoryFiltersContainer.appendChild(btn);
});

/****************************************************
 *          ÉCOUTE LA SAISIE DANS LA RECHERCHE
 ****************************************************/
searchInput.addEventListener("input", () => {
  renderCards();
});

/****************************************************
 *          FONCTION DE RENDU (AFFICHE LES CARTES)
 ****************************************************/
function renderCards() {
  galleryContainer.innerHTML = ""; // Nettoyage

  // Valeur tapée, en minuscule
  const query = searchInput.value.trim().toLowerCase();

  // Filtrage principal
  const filtered = projectsData.filter((item) => {
    // 1) Catégorie : compare en minuscules (ex: "App" vs. "app")
    const itemCat = item.category.toLowerCase();
    const filterCat = activeCategory.toLowerCase();
    const matchCategory = filterCat === "all" || itemCat === filterCat;

    // 2) Recherche textuelle (name, category, styles)
    const inName = item.name.toLowerCase().includes(query);
    const inCategory = itemCat.includes(query);
    const inStyles = item.styles.some((s) => s.toLowerCase().includes(query));

    const matchSearch = query === "" || inName || inCategory || inStyles;

    return matchCategory && matchSearch;
  });

  // Génération des cartes
  filtered.forEach((proj) => {
    // Conteneur .card
    const card = document.createElement("div");
    card.className = "card";

    // Ajout .card--app pour "App" (en min. ou maj.)
    if (proj.category.toLowerCase() === "app") {
      card.classList.add("card__app");
    }

    // Zone média
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "card__media";

    // Vidéo ?
    if (proj.video && proj.video !== "null") {
      const vid = document.createElement("video");
      vid.src = proj.video;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      mediaDiv.appendChild(vid);
    }
    // Sinon image ?
    else if (proj.image && proj.image !== "null") {
      const img = document.createElement("img");
      img.src = proj.image;
      mediaDiv.appendChild(img);
    }

    // Bookmark (icône SVG)
    const bookmark = document.createElement("a");
    bookmark.className = "card__bookmark";
    bookmark.href = proj.bookmarkLink || "#";
    bookmark.target = "_blank"; // Ajout de l'attribut target
    // Ici on insère le code SVG directement dans la balise
    bookmark.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>
    `;
    mediaDiv.appendChild(bookmark);

    // Contenu texte
    const contentDiv = document.createElement("div");
    contentDiv.className = "card__content";

    // Logo (optionnel)
    if (proj.logo && proj.logo !== "null") {
      const logoDiv = document.createElement("div");
      logoDiv.className = "card__logo";
      const logoImg = document.createElement("img");
      logoImg.src = proj.logo;
      logoDiv.appendChild(logoImg);
      contentDiv.appendChild(logoDiv);
    }

    // Nom
    const nameDiv = document.createElement("div");
    nameDiv.className = "card__name";
    const nameLink = document.createElement("a");
    nameLink.href = "#";
    nameLink.textContent = proj.name;
    nameDiv.appendChild(nameLink);

    contentDiv.appendChild(nameDiv);

    // On assemble
    card.appendChild(mediaDiv);
    card.appendChild(contentDiv);

    // On ajoute la carte dans la galerie
    galleryContainer.appendChild(card);
  });
}

// Premier rendu de la galerie
renderCards();
