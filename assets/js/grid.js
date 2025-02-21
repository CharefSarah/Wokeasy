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
    },
  ];

  let activeCategory = "All";
  let categories = [];

  async function fetchExternalProjects() {
    try {
      console.log("📥 Chargement des projets...");
      const response = await fetch(jsonUrl);
      const data = await response.json();

      if (!Array.isArray(data.projects)) {
        console.error(
          "❌ Erreur : Les projets ne sont pas sous forme de tableau."
        );
        return;
      }

      const formattedProjects = data.projects.map((proj) => ({
        name: proj.title || "Projet sans titre",
        bookmarkLink: proj.link || "#",
        category: proj.category !== "null" ? proj.category : "Autre",
        colors: proj.colors || [],
        styles: proj.styles || [],
        logo:
          proj.logo && proj.logo !== "null"
            ? proj.logo
            : "assets/images/avatar.png",
        image: proj.image && proj.image !== "null" ? proj.image : null,
        video: proj.video && proj.video !== "null" ? proj.video : null,
      }));

      allProjects = [...allProjects, ...formattedProjects];

      updateCategories();
      renderCards();
    } catch (error) {
      console.error("❌ Erreur de chargement du JSON :", error);
    }
  }

  function updateCategories() {
    categories = ["All", ...new Set(allProjects.map((p) => p.category))];

    categoryFiltersContainer.innerHTML = "";

    categories.forEach((cat) => {
      const count =
        cat === "All"
          ? allProjects.length
          : allProjects.filter(
              (p) => p.category.toLowerCase() === cat.toLowerCase()
            ).length;

      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.textContent = cat;

      const spanCount = document.createElement("span");
      spanCount.textContent = ` (${count})`;
      btn.appendChild(spanCount);

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

    const filtered = allProjects.filter((item) => {
      const itemCat = item.category.toLowerCase();
      const filterCat = activeCategory.toLowerCase();
      const matchCategory = filterCat === "all" || itemCat === filterCat;

      const inName = item.name.toLowerCase().includes(query);
      const inCategory = itemCat.includes(query);
      const inStyles = item.styles.some((s) => s.toLowerCase().includes(query));

      return (
        matchCategory && (query === "" || inName || inCategory || inStyles)
      );
    });

    filtered.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "card";

      if (proj.category.toLowerCase() === "app") {
        card.classList.add("card__app");
      }

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

      const bookmark = document.createElement("a");
      bookmark.className = "card__bookmark";
      bookmark.href = proj.bookmarkLink;
      bookmark.target = "_blank";
      bookmark.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>
          <path d="m21 3-9 9"/>
          <path d="M15 3h6v6"/>
        </svg>
      `;
      mediaDiv.appendChild(bookmark);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card__content";

      if (proj.logo) {
        const logoDiv = document.createElement("div");
        logoDiv.className = "card__logo";
        const logoImg = document.createElement("img");
        logoImg.src = proj.logo;
        logoDiv.appendChild(logoImg);
        contentDiv.appendChild(logoDiv);
      }

      const nameDiv = document.createElement("div");
      nameDiv.className = "card__name";
      const nameLink = document.createElement("a");
      nameLink.href = proj.bookmarkLink;
      nameLink.textContent = proj.name;
      nameDiv.appendChild(nameLink);
      contentDiv.appendChild(nameDiv);

      card.appendChild(mediaDiv);
      card.appendChild(contentDiv);
      galleryContainer.appendChild(card);
    });

    console.log("✅ Cartes mises à jour !");
  }

  // Gestion du "/" pour afficher les suggestions
  searchInput.addEventListener("input", function () {
    let query = this.value.trim();
    if (query.startsWith("/")) {
      query = query.substring(1);
      console.log("🔍 Suggestions pour :", query);
    }
  });

  // Gestion de "Ctrl + K" pour ouvrir la modale
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      console.log("🖥 Modale de recherche activée");
    }
  });

  fetchExternalProjects();
  searchInput.addEventListener("input", renderCards);
});
