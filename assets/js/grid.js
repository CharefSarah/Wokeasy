document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = "https://CharefSarah.github.io/Wokeasy/data.json";

  // Éléments du DOM
  const categoryFiltersContainer = document.getElementById("categoryFilters");
  const searchInput = document.getElementById("searchInput");
  const galleryContainer = document.getElementById("galleryContainer");

  let allProjects = [
    {
      name: "Sweetgreen",
      category: "App",
      colors: ["Green", "Beige"],
      styles: ["Minimal", "Modern"],
      bookmarkLink: "https://www.wearecollins.com/work/sweetgreen/",
      logo: "assets/images/sweetgreen.png",
      image: null,
      video: "assets/images/8aacfb61-f5af-4f1f-b4d3-fda769dbdc3e.mp4",
      creators: [
        {
          name: "WeAreCollins",
          link: "https://www.wearecollins.com/",
          avatar: "assets/images/avatar.png",
        },
      ],
      format: "app",
    },
    {
      name: "Ronas IT | UI/UX Team",
      category: "Web",
      colors: ["Green", "White"],
      styles: ["Clean"],
      bookmarkLink:
        "https://dribbble.com/shots/25605816-E-commerce-Website-Design-Concept",
      logo: "assets/images/ronas.webp",
      image: "assets/images/s.webp",
      video: null,
      creators: [
        {
          name: "Ronas IT",
          link: "https://dribbble.com/RonasIT",
          avatar: null,
        },
      ],
    },
  ];

  let activeCategory = "All";
  let categories = [];

  function updateCategories() {
    categories = ["All", ...new Set(allProjects.map((p) => p.category))];
    categoryFiltersContainer.innerHTML = "";

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.textContent = `${cat} (${
        allProjects.filter((p) => p.category === cat || cat === "All").length
      })`;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = cat;
        renderCards();
      });
      categoryFiltersContainer.appendChild(btn);
    });
  }

  function renderCards() {
    galleryContainer.innerHTML = "";
    const query = searchInput.value.trim().toLowerCase();

    const filtered = allProjects.filter((proj) => {
      const matchCategory =
        activeCategory === "All" ||
        proj.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        query === "" || proj.name.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    filtered.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "card";
      if (proj.format === "app") card.classList.add("card__app");
      if (proj.format === "reel") card.classList.add("card__reel");

      const mediaDiv = document.createElement("div");
      mediaDiv.className = "card__media";

      if (proj.video) {
        const vid = document.createElement("video");
        vid.src = proj.video;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        mediaDiv.appendChild(vid);
      } else if (proj.image) {
        const img = document.createElement("img");
        img.src = proj.image;
        mediaDiv.appendChild(img);
      }

      if (proj.bookmarkLink) {
        const bookmarkLink = document.createElement("a");
        bookmarkLink.href = proj.bookmarkLink;
        bookmarkLink.target = "_blank"; // Ajout de l'attribut target
        bookmarkLink.className = "card__bookmark";
        bookmarkLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>`;
        bookmarkLink.style.position = "absolute";
        bookmarkLink.style.top = "var(--spacing__xs)";
        bookmarkLink.style.right = "var(--spacing__xs)";
        bookmarkLink.style.opacity = "0";
        bookmarkLink.style.transition = "opacity 0.3s ease";
        mediaDiv.appendChild(bookmarkLink);

        card.addEventListener("mouseover", () => {
          bookmarkLink.style.opacity = "1";
        });
        card.addEventListener("mouseleave", () => {
          bookmarkLink.style.opacity = "0";
        });
      }

      const contentDiv = document.createElement("div");
      contentDiv.className = "card__content";

      const nameDiv = document.createElement("div");
      nameDiv.className = "card__name";
      nameDiv.textContent = proj.name;

      const creatorsDiv = document.createElement("div");
      creatorsDiv.className = "card__creators";
      proj.creators.forEach((creator) => {
        const creatorLink = document.createElement("a");
        creatorLink.href = creator.link || "#";
        creatorLink.target = "_blank"; // Ajout de l'attribut target
        creatorLink.className = "card__creator";
        if (creator.avatar) {
          const avatarImg = document.createElement("img");
          avatarImg.src = creator.avatar;
          creatorLink.appendChild(avatarImg);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "creator__placeholder";
          placeholder.textContent = creator.name.charAt(0).toUpperCase();
          creatorLink.appendChild(placeholder);
        }
        creatorsDiv.appendChild(creatorLink);
      });

      // Inverser l'ordre des éléments
      contentDiv.appendChild(nameDiv);
      contentDiv.appendChild(creatorsDiv);

      card.appendChild(mediaDiv);
      card.appendChild(contentDiv);
      galleryContainer.appendChild(card);
    });
  }

  async function fetchExternalProjects() {
    try {
      const response = await fetch(jsonUrl);
      const data = await response.json();
      if (!Array.isArray(data.projects)) return;

      allProjects = [
        ...allProjects,
        ...data.projects.map((proj) => ({
          name: proj.title || "Projet sans titre",
          bookmarkLink: proj.link || "#",
          category: proj.category !== "null" ? proj.category : "Web",
          colors: proj.colors || [],
          styles: proj.styles || [],
          logo: proj.logo !== "null" ? proj.logo : "assets/images/avatar.png",
          image: proj.image !== "null" ? proj.image : null,
          video: proj.video !== "null" ? proj.video : null,
          creators: proj.creators || [],
          format: proj.format || "standard",
        })),
      ];

      shuffleArray(allProjects);
      updateCategories();
      renderCards();
    } catch (error) {
      console.error("❌ Erreur de chargement du JSON :", error);
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  fetchExternalProjects();
  searchInput.addEventListener("input", renderCards);
});
