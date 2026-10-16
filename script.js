const questions = [
  { number: 1, question: "Имеют ли право родители реализовывать свои  идеалы через ребенка,  лишая его права на детство?" },
  { number: 2, question: "Права ли Мария Корелли, утверждая в предисловии, что воспитание детей без веры — это «преступление хуже убийства»?" },
  { number: 3, question: "По твоему мнению, что именно подтолкнуло Лионеля к трагическому финалу?" },
  { number: 4, question: "Как вы думаете, изменит ли гибель сына, мировоззрение отца?" },
  { number: 5, question: "Видишь ли ты связь двух романов М. Корелли?" },
  { number: 6, question: "Как повлиял уход матери на дальнейшую судьбу Лионеля?" },
  { number: 7, question: "Как ты думаешь, почему Лионель не бунтовал против таких методов воспитания и как бы повели себя современные дети?" },
  { number: 8, question: "Представь если бы Сатана встретил отца мальчика, стал бы он помогать ему в его \"эксперименте\" или все же принял сторону мальчика?" },
  { number: 9, question: "Какой момент из книги был самым приятным и почему?" }
];

const STORAGE_KEY = "corelli-bookclub-selected-v1";
const grid = document.querySelector("#scrollGrid");
const dialog = document.querySelector("#questionDialog");
const dialogNumber = document.querySelector("#dialogNumber");
const dialogTitle = document.querySelector("#dialogTitle");
const closeDialog = document.querySelector("#closeDialog");
const progressText = document.querySelector("#progressText");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const resetButton = document.querySelector("#resetButton");
const finishedMessage = document.querySelector("#finishedMessage");

function readSelected() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(n => questions.some(q => q.number === n)) : [];
  } catch {
    return [];
  }
}
let selectedNumbers = readSelected();

function saveSelected() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedNumbers)); }
  catch { /* If browser storage is unavailable, the current session still works. */ }
}

function updateProgress() {
  const count = selectedNumbers.length;
  const percent = Math.round((count / questions.length) * 100);
  progressText.textContent = `Выбрано: ${count} из ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  finishedMessage.hidden = count !== questions.length;
}

function renderScrolls() {
  grid.innerHTML = "";
  questions.forEach((item) => {
    const selected = selectedNumbers.includes(item.number);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `scroll-card${selected ? " is-selected" : ""}`;
    button.disabled = selected;
    button.setAttribute("aria-label", selected ? `Вопрос ${item.number} уже выбран` : `Открыть вопрос ${item.number}`);
    button.innerHTML = `
      ${selected ? '<span class="selected-stamp" aria-hidden="true">✓</span>' : ""}
      <span class="scroll-number">${String(item.number).padStart(2, "0")}</span>
      <span class="scroll-rule" aria-hidden="true"></span>
      <span class="scroll-label">Вопрос для обсуждения</span>
      <span class="scroll-hint">${selected ? "Уже выбран" : "Нажми, чтобы раскрыть"}</span>
    `;
    if (!selected) button.addEventListener("click", () => openQuestion(item));
    grid.appendChild(button);
  });
  updateProgress();
}

function openQuestion(item) {
  // Mark as selected immediately: the same scroll cannot be opened again this session or after refresh.
  if (selectedNumbers.includes(item.number)) return;
  selectedNumbers.push(item.number);
  saveSelected();
  renderScrolls();
  dialogNumber.textContent = `ВОПРОС ${String(item.number).padStart(2, "0")}`;
  dialogTitle.textContent = item.question;
  dialog.showModal();
}

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
resetButton.addEventListener("click", () => {
  const confirmed = window.confirm("Начать заново? Все отметки выбранных свитков будут сброшены.");
  if (!confirmed) return;
  selectedNumbers = [];
  saveSelected();
  renderScrolls();
  if (dialog.open) dialog.close();
});

renderScrolls();
