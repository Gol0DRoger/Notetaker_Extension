const noteArea = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");

// Load saved note from localStorage
noteArea.value = localStorage.getItem("autosave_note") || "";

// Auto-save while typing
noteArea.addEventListener("input", () => {
  localStorage.setItem("autosave_note", noteArea.value);
});

// Save note to file with incremented filename
saveBtn.addEventListener("click", function () {
  const noteContent = noteArea.value;
  const blob = new Blob([noteContent], { type: "text/plain" });

  chrome.storage.local.get({ noteCounter: 1 }, function (data) {
    const count = data.noteCounter;
    const filename = `note_${count}.txt`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    chrome.storage.local.set({ noteCounter: count + 1 });
    localStorage.removeItem("autosave_note");
    noteArea.value = "";
  });
});
