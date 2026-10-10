(() => {
  "use strict";
  const STORAGE_KEY = "habitflow.habits.v1";
  const $ = (selector) => document.querySelector(selector);
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const dateKey = today();
  let habits = loadHabits();
  let activeFilter = "all";
  let editingId = null;
  let toastTimer = null;

  function loadHabits() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(h => h && typeof h.id === "string" && typeof h.name === "string") : [];
    } catch {
      return [];
    }
  }
  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      return true;
    } catch {
      showToast("Could not save data in this browser.");
      return false;
    }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  function isDone(habit) { return Array.isArray(habit.completedDates) && habit.completedDates.includes(dateKey); }
  function updateStats() {
    const completed = habits.filter(isDone).length;
    const total = habits.length;
    const percent = total ? Math.round(completed / total * 100) : 0;
    $("#progressStat").textContent = `${percent}%`;
    $("#completedStat").textContent = `${completed} / ${total}`;
    $("#totalStat").textContent = String(total);
    $("#progressBar").style.width = `${percent}%`;
    $("#progressMessage").textContent = !total ? "Add a habit to set your daily target." :
      percent === 100 ? "Amazing! You completed every habit today." :
      `${completed} of ${total} habits completed. Keep going!`;
  }
  function render() {
    const list = $("#habitList");
    const visible = habits.filter(h => activeFilter === "all" || (activeFilter === "completed" ? isDone(h) : !isDone(h)));
    list.innerHTML = visible.map(h => `
      <article class="habit-item ${isDone(h) ? "is-done" : ""}" data-id="${escapeHTML(h.id)}">
        <button class="check-button ${isDone(h) ? "done" : ""}" data-action="toggle" aria-label="${isDone(h) ? "Mark incomplete" : "Mark complete"}: ${escapeHTML(h.name)}">${isDone(h) ? "✓" : ""}</button>
        <div class="habit-info">
          <p class="habit-name">${escapeHTML(h.name)}</p>
          <div class="habit-meta"><span class="pill category">${escapeHTML(h.category || "Other")}</span><span class="pill">${escapeHTML(h.time || "Anytime")}</span></div>
        </div>
        <div class="habit-actions">
          <button class="small-action" data-action="edit" aria-label="Edit ${escapeHTML(h.name)}">Edit</button>
          <button class="small-action" data-action="delete" aria-label="Delete ${escapeHTML(h.name)}">Delete</button>
        </div>
      </article>`).join("");
    $("#emptyState").classList.toggle("hidden", visible.length > 0);
    list.classList.toggle("hidden", visible.length === 0);
    updateStats();
    document.querySelectorAll(".filter").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === activeFilter));
  }
  function openForm(habit = null) {
    editingId = habit ? habit.id : null;
    $("#habitForm").classList.remove("hidden");
    $("#formHeading").textContent = habit ? "Edit habit" : "Create a habit";
    $("#saveHabitBtn").textContent = habit ? "Update habit" : "Save habit";
    $("#habitName").value = habit ? habit.name : "";
    $("#habitCategory").value = habit ? (habit.category || "Other") : "Wellness";
    $("#habitTime").value = habit ? (habit.time || "Anytime") : "Anytime";
    $("#formError").textContent = "";
    $("#habitName").focus();
  }
  function closeForm() {
    $("#habitForm").classList.add("hidden");
    $("#habitForm").reset();
    editingId = null;
    $("#formError").textContent = "";
  }
  function addOrUpdateHabit(event) {
    event.preventDefault();
    const name = $("#habitName").value.trim();
    if (!name) { $("#formError").textContent = "Please enter a habit name."; return; }
    if (name.length > 60) { $("#formError").textContent = "Habit name must be 60 characters or fewer."; return; }
    const duplicate = habits.some(h => h.name.toLowerCase() === name.toLowerCase() && h.id !== editingId);
    if (duplicate) { $("#formError").textContent = "A habit with this name already exists."; return; }
    if (editingId) {
      const habit = habits.find(h => h.id === editingId);
      if (!habit) { closeForm(); return; }
      habit.name = name;
      habit.category = $("#habitCategory").value;
      habit.time = $("#habitTime").value;
      showToast("Habit updated.");
    } else {
      habits.push({ id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), name,
        category: $("#habitCategory").value, time: $("#habitTime").value, createdAt: dateKey, completedDates: [] });
      showToast("Habit added. Nice start!");
    }
    saveHabits(); closeForm(); render();
  }
  function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    if (!Array.isArray(habit.completedDates)) habit.completedDates = [];
    if (isDone(habit)) habit.completedDates = habit.completedDates.filter(d => d !== dateKey);
    else habit.completedDates.push(dateKey);
    saveHabits(); render();
    showToast(isDone(habit) ? "Habit completed!" : "Habit marked as not completed.");
  }
  function deleteHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    if (!window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) return;
    habits = habits.filter(h => h.id !== id);
    saveHabits(); render(); showToast("Habit deleted.");
  }

  $("#todayLabel").textContent = new Date().toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric", year:"numeric" });
  $("#habitForm").addEventListener("submit", addOrUpdateHabit);
  $("#openFormBtn").addEventListener("click", () => openForm());
  $("#emptyAddBtn").addEventListener("click", () => openForm());
  $("#cancelFormBtn").addEventListener("click", closeForm);
  $("#cancelFormBtn2").addEventListener("click", closeForm);
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => { activeFilter = btn.dataset.filter; render(); }));
  $("#habitList").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = button.closest(".habit-item");
    const id = item && item.dataset.id;
    if (!id) return;
    if (button.dataset.action === "toggle") toggleHabit(id);
    if (button.dataset.action === "edit") {
      const habit = habits.find(h => h.id === id);
      if (habit) openForm(habit);
    }
    if (button.dataset.action === "delete") deleteHabit(id);
  });
  render();
})();
