const form = document.getElementById("studyForm");
const subjectInput = document.getElementById("subject");
const hoursInput = document.getElementById("hours");
const dateInput = document.getElementById("date");
const tableBody = document.querySelector("#studyTable tbody");
const totalDisplay = document.getElementById("totalHours");

let studyData = JSON.parse(localStorage.getItem("studyData")) || [];
let chart;

// Save data
function saveData() {
  localStorage.setItem("studyData", JSON.stringify(studyData));
}

// Update table
function updateTable() {
  tableBody.innerHTML = "";
  let total = 0;

  studyData.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.subject}</td>
      <td>${entry.hours}</td>
      <td><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
    total += Number(entry.hours);
  });

  totalDisplay.textContent = `Total: ${total.toFixed(1)} hrs`;
  updateChart();
}

// Add entry
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const subject = subjectInput.value.trim();
  const hours = parseFloat(hoursInput.value);
  const date = dateInput.value;

  if (!subject || hours <= 0 || !date) return;

  studyData.push({ subject, hours, date });
  saveData();
  updateTable();
  form.reset();
});

// Delete entry
function deleteEntry(index) {
  studyData.splice(index, 1);
  saveData();
  updateTable();
}

// Chart
function updateChart() {
  const dateMap = {};

  studyData.forEach((entry) => {
    if (dateMap[entry.date]) {
      dateMap[entry.date] += Number(entry.hours);
    } else {
      dateMap[entry.date] = Number(entry.hours);
    }
  });

  const labels = Object.keys(dateMap);
  const values = Object.values(dateMap);

  const ctx = document.getElementById("studyChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Study Hours",
          data: values,
          borderWidth: 1,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initialize
updateTable();
