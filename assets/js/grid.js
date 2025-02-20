document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = "https://CharefSarah.github.io/Wokeasy/data.json";

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

      const formattedProjects = data.projects.map((proj) => {
        let imageUrl = "assets/images/placeholder.jpg"; // Image du projet par défaut
        let avatarUrl = "assets/images/default-avatar.png"; // Avatar par défaut

        if (proj.description && typeof proj.description === "string") {
          // 🔥 Extraction de l'image principale du projet
          const imgMatch = proj.description.match(/src='([^']+)'/);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1].trim();
          }
        }

        return {
          name: proj.title || "Projet sans titre",
          bookmarkLink: proj.link || "#",
          category: proj.category !== "null" ? proj.category : "Autre",
          colors: proj.colors || [],
          styles: proj.styles || [],
          logo: avatarUrl, // Utilisation d'un avatar par défaut
          image: imageUrl,
          video: proj.video || null,
        };
      });

      allProjects = [...formattedProjects];
      console.log("✅ Données formatées :", allProjects);
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
        img.onerror = function () {
          this.src = "assets/images/placeholder.jpg"; // Fallback si l'image ne charge pas
        };
        mediaDiv.appendChild(img);
      }

      const bookmark = document.createElement("a");
      bookmark.className = "card__bookmark";
      bookmark.href = proj.bookmarkLink;
      bookmark.target = "_blank";
      bookmark.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>`;
      mediaDiv.appendChild(bookmark);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card__content";

      const logoDiv = document.createElement("div");
      logoDiv.className = "card__logo";
      const logoImg = document.createElement("img");
      logoImg.src = proj.logo;
      logoDiv.appendChild(logoImg);
      contentDiv.appendChild(logoDiv);

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
