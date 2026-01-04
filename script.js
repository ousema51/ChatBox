
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatMessages = document.getElementById("chatMessages");

  function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    // Create message bubble
    const message = document.createElement("div");
    message.classList.add("message", "user");
    message.textContent = text;

    // Add to chat
    chatMessages.appendChild(message);

    // Clear input
    input.value = "";

    // Auto scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI response will go here later
    console.log("User sent:", text);
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });