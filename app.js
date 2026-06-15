const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDate = new Date();

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty";
    calendar.appendChild(emptyDiv);
  }

  for (let date = 1; date <= lastDate; date++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const today = new Date();

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      date === today.getDate()
    ) {
      dayDiv.classList.add("today");
    }

    const dateText = document.createElement("div");
    dateText.className = "date";
    dateText.textContent = date;

    const dayOfWeek = new Date(year, month, date).getDay();

    if (dayOfWeek === 0) {
      dateText.classList.add("sunday");
    } else if (dayOfWeek === 6) {
      dateText.classList.add("saturday");
    }

    dayDiv.appendChild(dateText);

    const key = `${year}-${month + 1}-${date}`;
    const savedEvents = JSON.parse(localStorage.getItem(key)) || [];

    savedEvents.forEach(function (eventText, index) {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event";
      eventDiv.textContent = eventText;

      eventDiv.addEventListener("click", function (event) {
        event.stopPropagation();

        const newText = prompt("일정을 수정하세요", eventText);

        if (newText) {
          savedEvents[index] = newText;
          localStorage.setItem(key, JSON.stringify(savedEvents));
          renderCalendar();
        }
      });

      eventDiv.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const deleteConfirm = confirm(`"${eventText}" 일정을 삭제할까요?`);

        if (deleteConfirm) {
          savedEvents.splice(index, 1);

          if (savedEvents.length === 0) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(savedEvents));
          }

          renderCalendar();
        }
      });

      dayDiv.appendChild(eventDiv);
    });

    dayDiv.addEventListener("click", function () {
      const eventText = prompt(`${year}년 ${month + 1}월 ${date}일 일정 입력`);

      if (eventText) {
        savedEvents.push(eventText);
        localStorage.setItem(key, JSON.stringify(savedEvents));
        renderCalendar();
      }
    });

    calendar.appendChild(dayDiv);
  }
}

prevBtn.addEventListener("click", function () {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", function () {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();