
const mealCheckboxes = document.querySelectorAll('input[name="meal"]');
const waterCheckboxes = document.querySelectorAll('input[name="water"]');
const totalCaloriesSpan = document.getElementById('total-calories');
const totalWaterSpan = document.getElementById('total-water');

mealCheckboxes.forEach(cb => {
  cb.addEventListener('change', updateCalories);
});

waterCheckboxes.forEach(cb => {
  cb.addEventListener('change', updateWater);
});

function updateCalories() {
  let total = 0;
  mealCheckboxes.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.getAttribute('data-cal')) || 0;
    }
  });
  totalCaloriesSpan.textContent = total;
}

function updateWater() {
  let total = 0;
  waterCheckboxes.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.value) || 0;
    }
  });
  totalWaterSpan.textContent = total;
}


const progressForm = document.getElementById('progress-form');
const recordsContainer = document.getElementById('records-container');

let records = JSON.parse(localStorage.getItem('progressRecords')) || [];

renderRecords();

progressForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const photoFile = document.getElementById('photo').files[0];

  if (!photoFile) {
    alert('Por favor, selecione uma foto.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const photoUrl = event.target.result;

    const newRecord = { date, weight, photo: photoUrl };
    records.push(newRecord);

    localStorage.setItem('progressRecords', JSON.stringify(records));

    renderRecords();
    progressForm.reset();
  };

  reader.readAsDataURL(photoFile);
});

function renderRecords() {
  recordsContainer.innerHTML = '';

  if (records.length === 0) {
    recordsContainer.innerHTML = '<p>Nenhum registro até agora.</p>';
    return;
  }

  records.forEach((record, index) => {
    const div = document.createElement('div');
    div.classList.add('record');
    div.innerHTML = `
      <p><strong>Data:</strong> ${record.date}</p>
      <p><strong>Peso:</strong> ${record.weight} kg</p>
      <img src="${record.photo}" alt="Progresso ${record.date}" class="thumbnail" data-index="${index}">
      <hr/>
    `;
    recordsContainer.appendChild(div);
  });

  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(img => {
    img.addEventListener('click', (e) => {
      const src = e.target.src;
      showModal(src);
    });
  });
}


const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

function showModal(src) {
  modalImg.src = src;
  modal.classList.add('show');
}

modal.addEventListener('click', () => {
  modal.classList.remove('show');
});


const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
  if (confirm('Deseja realmente resetar tudo? Isso apagará os registros e desmarcará tudo.')) {
    mealCheckboxes.forEach(cb => cb.checked = false);
    waterCheckboxes.forEach(cb => cb.checked = false);
    updateCalories();
    updateWater();

    records = [];
    localStorage.removeItem('progressRecords');
    renderRecords();
  }
});
document.querySelectorAll('article.meal').forEach(meal => {
    const checkboxes = meal.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          checkboxes.forEach(cb => {
            if (cb !== checkbox) cb.checked = false;
          });
        }
        updateCalories();
      });
    });
  });
