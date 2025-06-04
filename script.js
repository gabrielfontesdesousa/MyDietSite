const mealCheckboxes = document.querySelectorAll('input[name="meal"]');
const waterCheckboxes = document.querySelectorAll('input[name="water"]');
const totalCaloriesSpan = document.getElementById("total-calories");
const totalWaterSpan = document.getElementById("total-water");

// Carregar estado dos checkboxes ao iniciar
window.addEventListener("load", () => {
  loadCheckboxState();
  updateCalories();
  updateWater();
});

mealCheckboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    updateCalories();
    saveCheckboxState();
  });
});

waterCheckboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    updateWater();
    saveCheckboxState();
  });
});

function updateCalories() {
  let total = 0;
  mealCheckboxes.forEach((cb) => {
    if (cb.checked) {
      total += parseInt(cb.getAttribute("data-cal")) || 0;
    }
  });
  totalCaloriesSpan.textContent = total;
}

function updateWater() {
  let total = 0;
  waterCheckboxes.forEach((cb) => {
    if (cb.checked) {
      total += parseInt(cb.value) || 0;
    }
  });
  totalWaterSpan.textContent = total;
}

// ✅ Função para salvar estado dos checkboxes no localStorage
function saveCheckboxState() {
  const mealState = Array.from(mealCheckboxes).map(cb => cb.checked);
  const waterState = Array.from(waterCheckboxes).map(cb => cb.checked);
  localStorage.setItem("mealCheckboxState", JSON.stringify(mealState));
  localStorage.setItem("waterCheckboxState", JSON.stringify(waterState));
}

// ✅ Função para carregar estado dos checkboxes do localStorage
function loadCheckboxState() {
  const mealState = JSON.parse(localStorage.getItem("mealCheckboxState"));
  const waterState = JSON.parse(localStorage.getItem("waterCheckboxState"));

  if (mealState) {
    mealCheckboxes.forEach((cb, index) => {
      cb.checked = mealState[index] || false;
    });
  }

  if (waterState) {
    waterCheckboxes.forEach((cb, index) => {
      cb.checked = waterState[index] || false;
    });
  }
}

// 📸 Parte dos registros de progresso
const progressForm = document.getElementById("progress-form");
const recordsContainer = document.getElementById("records-container");

let records = JSON.parse(localStorage.getItem("progressRecords")) || [];

renderRecords();

progressForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const photoFile = document.getElementById("photo").files[0];

  if (!photoFile) {
    alert("Por favor, selecione uma foto.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const photoUrl = event.target.result;

    const newRecord = { date, weight, photo: photoUrl };
    records.push(newRecord);

    localStorage.setItem("progressRecords", JSON.stringify(records));

    renderRecords();
    progressForm.reset();
  };

  reader.readAsDataURL(photoFile);
});

function renderRecords() {
  recordsContainer.innerHTML = "";

  if (records.length === 0) {
    recordsContainer.innerHTML = "<p>Nenhum registro até agora.</p>";
    return;
  }

  records.forEach((record, index) => {
    const div = document.createElement("div");
    div.classList.add("record");
    div.innerHTML = `
      <p><strong>Data:</strong> ${record.date}</p>
      <p><strong>Peso:</strong> ${record.weight} kg</p>
      <img src="${record.photo}" alt="Progresso ${record.date}" class="thumbnail" data-index="${index}">
      <button class="remove-btn">Remover</button>
      <hr/>
    `;

    // Abrir foto no modal
    div.querySelector("img").addEventListener("click", (e) => {
      const src = e.target.src;
      showModal(src);
    });

    // Remover registro
    div.querySelector(".remove-btn").addEventListener("click", () => {
      records.splice(index, 1);
      localStorage.setItem("progressRecords", JSON.stringify(records));
      renderRecords();
    });

    recordsContainer.appendChild(div);
  });
}

// 🔍 Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

function showModal(src) {
  modalImg.src = src;
  modal.classList.add("show");
}

modal.addEventListener("click", () => {
  modal.classList.remove("show");
});

// 🔄 Resetar tudo
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {
  if (
    confirm(
      "Deseja realmente resetar tudo? Isso apagará os registros e desmarcará tudo."
    )
  ) {
    mealCheckboxes.forEach((cb) => (cb.checked = false));
    waterCheckboxes.forEach((cb) => (cb.checked = false));
    updateCalories();
    updateWater();
    saveCheckboxState();

    records = [];
    localStorage.removeItem("progressRecords");
    localStorage.removeItem("mealCheckboxState");
    localStorage.removeItem("waterCheckboxState");
    renderRecords();
  }
});

// ✅ Bloquear múltiplas escolhas na mesma refeição
document.querySelectorAll("article.meal").forEach((meal) => {
  const checkboxes = meal.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        checkboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
      }
      updateCalories();
      saveCheckboxState();
    });
  });
});
