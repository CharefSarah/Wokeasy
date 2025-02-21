document.addEventListener("DOMContentLoaded", function () {
  // 🎯 Sélection des éléments du DOM
  const searchInput = document.getElementById("search__input");
  const searchSuggestions = document.getElementById("search__suggestions");
  const modal = document.getElementById("searchModal");
  const modalOverlay = document.querySelector(".modal__overlay");
  const modalInput = document.getElementById("modalSearchInput");
  const modalSuggestions = document.getElementById("modalSuggestions");
  const modalClose = document.getElementById("modalClose");
  const searchTrigger = document.querySelector(".search__trigger");

  let selectedIndex = -1;

  // 💡 Données pour les suggestions avec icônes
  const suggestions = [
    { name: "Figma", icon: "lucide-figma" },
    { name: "Adobe XD", icon: "lucide-pen-tool" },
    { name: "Dribbble", icon: "lucide-dribbble" },
    { name: "Sketch", icon: "lucide-pen-tool" },
    { name: "React", icon: "lucide-react" },
    { name: "Vue.js", icon: "lucide-vue" },
    { name: "Svelte", icon: "lucide-fire" },
    { name: "Awwwards", icon: "lucide-star" },
    { name: "Webflow", icon: "lucide-globe" },
    { name: "Framer", icon: "lucide-frame" },
  ];

  /****************************************************
   * 🔍 Gestion des suggestions dynamiques "/"
   ****************************************************/
  function showSuggestions(query) {
    searchSuggestions.innerHTML = "";
    selectedIndex = -1;

    let filteredSuggestions = suggestions.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSuggestions.length === 0) {
      searchSuggestions.style.display = "none";
      return;
    }

    filteredSuggestions.forEach((item, index) => {
      const suggestionElement = document.createElement("div");
      suggestionElement.classList.add("search__suggestion");
      suggestionElement.dataset.index = index;

      // Ajout de l'icône SVG
      suggestionElement.innerHTML = `
        <span class="search__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" class="lucide ${item.icon}">
          </svg>
        </span>
        <span>${item.name}</span>
      `;

      suggestionElement.addEventListener("click", () => {
        selectSuggestion(index);
      });

      searchSuggestions.appendChild(suggestionElement);
    });

    searchSuggestions.style.display = "block";
  }

  function selectSuggestion(index) {
    searchInput.value = suggestions[index].name;
    searchSuggestions.style.display = "none";
  }

  function updateSelection() {
    const items = document.querySelectorAll(".search__suggestion");
    items.forEach((item) => item.classList.remove("selected"));

    if (selectedIndex !== -1) {
      items[selectedIndex].classList.add("selected");
      searchInput.value = suggestions[selectedIndex].name;
    }
  }

  searchInput.addEventListener("input", function () {
    let query = this.value.trim();
    if (query.startsWith("/")) {
      query = query.substring(1);
      showSuggestions(query);
    } else {
      searchSuggestions.style.display = "none";
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    const items = document.querySelectorAll(".search__suggestion");
    if (items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection();
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      event.preventDefault();
      selectSuggestion(selectedIndex);
    } else if (event.key === "Escape") {
      searchSuggestions.style.display = "none";
    }
  });

  /****************************************************
   * 🖥️ Gestion de la modale "Ctrl + K" avec catégories
   ****************************************************/
  const modalData = [
    {
      category: "Design Tools",
      items: [
        { name: "Figma", icon: "lucide-figma" },
        { name: "Adobe XD", icon: "lucide-pen-tool" },
        { name: "Sketch", icon: "lucide-pen-tool" },
      ],
    },
    {
      category: "Development",
      items: [
        { name: "React", icon: "lucide-react" },
        { name: "Vue.js", icon: "lucide-vue" },
        { name: "Svelte", icon: "lucide-fire" },
      ],
    },
    {
      category: "Web Design",
      items: [
        { name: "Awwwards", icon: "lucide-star" },
        { name: "Webflow", icon: "lucide-globe" },
        { name: "Framer", icon: "lucide-frame" },
      ],
    },
  ];

  function showModal() {
    modal.style.display = "flex";
    modalInput.focus();
    renderModalSuggestions("");
  }

  function closeModal() {
    modal.style.display = "none";
    modalInput.value = "";
    modalSuggestions.innerHTML = "";
    selectedIndex = -1;
  }

  function renderModalSuggestions(query) {
    modalSuggestions.innerHTML = "";
    selectedIndex = -1;

    modalData.forEach((group) => {
      const matchingItems = group.items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingItems.length > 0) {
        const groupElement = document.createElement("div");
        groupElement.classList.add("suggestion__group");
        groupElement.textContent = group.category;
        modalSuggestions.appendChild(groupElement);

        matchingItems.forEach((item, index) => {
          const itemElement = document.createElement("div");
          itemElement.classList.add("suggestion__item");
          itemElement.dataset.index = index;

          itemElement.innerHTML = `
            <span class="search__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" class="lucide ${item.icon}">
              </svg>
            </span>
            <span>${item.name}</span>
          `;

          itemElement.addEventListener("click", () => {
            modalInput.value = item.name;
            closeModal();
          });

          modalSuggestions.appendChild(itemElement);
        });
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      showModal();
    }
  });

  modalInput.addEventListener("input", function () {
    renderModalSuggestions(this.value.trim());
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  searchTrigger.addEventListener("click", function () {
    showModal();
  });
});
