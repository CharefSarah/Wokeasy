document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = "https://CharefSarah.github.io/Wokeasy/data.json";

  // 🔹 Liste des projets existants (statiques)
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
      colors: ["Green", "White"],
      styles: ["Clean"],
      bookmarkLink:
        "https://dribbble.com/shots/25605816-E-commerce-Website-Design-Concept",
      logo: "assets/images/ronas.webp",
      image: "assets/images/s.webp",
      video: null,
    },
  ];

  let allProjects = [...projectsData]; // 🔹 Fusion des projets locaux

  async function fetchExternalProjects() {
    try {
      console.log("📥 Chargement des projets...");
      const response = await fetch(jsonUrl);
      const data = await response.json();

      console.log("🔍 Données récupérées :", data.projects);

      if (!Array.isArray(data.projects)) {
        console.error(
          "❌ Erreur : Les projets ne sont pas sous forme de tableau."
        );
        return;
      }

      // 🔥 Transformation des données récupérées
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

      allProjects = [...projectsData, ...formattedProjects];
      console.log("✅ Données formatées avec images :", allProjects);
      renderCards();
    } catch (error) {
      console.error("❌ Erreur de chargement du JSON :", error);
    }
  }

  function renderCards() {
    const galleryContainer = document.getElementById("galleryContainer");
    galleryContainer.innerHTML = ""; // Nettoyage

    allProjects.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "card";

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
        img.alt = proj.name;

        img.onload = () => console.log("✅ Image chargée :", proj.image);
        img.onerror = () =>
          console.error("❌ Erreur de chargement :", proj.image);

        mediaDiv.appendChild(img);
      } else {
        console.warn("⚠️ Aucune image ou vidéo pour :", proj.name);
      }

      const bookmark = document.createElement("a");
      bookmark.className = "card__bookmark";
      bookmark.href = proj.bookmarkLink;
      bookmark.target = "_blank";
      bookmark.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>`;
      mediaDiv.appendChild(bookmark);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card__content";

      if (proj.logo) {
        const logoDiv = document.createElement("div");
        logoDiv.className = "card__logo";
        const logoImg = document.createElement("img");
        logoImg.src = proj.logo;
        logoImg.alt = proj.name + " logo";

        logoImg.onload = () => console.log("✅ Logo chargé :", proj.logo);
        logoImg.onerror = () =>
          console.error("❌ Erreur de chargement du logo :", proj.logo);

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

  fetchExternalProjects();
});
