document.getElementById("saveBtn").addEventListener("click", function () {
    const noteContent = document.getElementById("note").value;
  
    // Create a Blob object with the text
    const blob = new Blob([noteContent], { type: "text/plain" });
    
    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "note.txt";
    
    // Programmatically click the link to trigger the download
    link.click();
});

let recognition;
let isRecognizing = false;

document.getElementById("micBtn").addEventListener("click", function () {
  // Check if the browser supports Speech Recognition
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  // Initialize speech recognition if it's not already created
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Stop automatically after speaking
    recognition.interimResults = false; // Only return final results
    recognition.lang = 'en-US'; // Set language for speech recognition

    recognition.onstart = function () {
      isRecognizing = true;
      document.getElementById("micBtn").textContent = "STOP"; // Update button when recording starts
    };

    recognition.onend = function () {
      isRecognizing = false;
      document.getElementById("micBtn").textContent = "SPEAK"; // Reset button after recording stops
    };

    recognition.onresult = function (event) {
      let transcript = event.results[0][0].transcript; // Get the transcribed text
      document.getElementById('note').value += transcript; // Append the transcribed text to the textarea
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error: ", event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone permissions for this extension.");
      } else if (event.error === 'no-speech') {
        alert("No speech detected. Please try again.");
      }
    };
  }

  // Toggle speech recognition
  if (isRecognizing) {
    recognition.stop(); // Stop recognition if it's running
  } else {
    try {
      recognition.start(); // Start recognition if it's not running
    } catch (error) {
      console.error("Speech recognition start error: ", error);
    }
  }
});
