// Get elements from HTML
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

// Add a message bubble to the chat
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to backend + receive AI reply
async function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  // Show user message
  addMessage(text, "user");
  input.value = "";

  // Show temporary AI message
  addMessage("Thinking...", "ai");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    // Remove "Thinking..." message
    const thinkingMsg = document.querySelector(".message.ai:last-child");
    if (thinkingMsg) thinkingMsg.remove();

    // Get AI text
    const aiText =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].me
