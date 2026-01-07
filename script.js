// --- Select HTML elements ---
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

// ---- SESSION ID (DO NOT TOUCH AFTER ADDING) ----
let sessionId = localStorage.getItem("session_id");

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("session_id", sessionId);
}

// --- Helper function to add messages ---
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// --- Backend URL ---
const VERCEL_API_URL = "https://chat-box-dun.vercel.app/api/chat";

// --- Send message function ---
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, "user");
  input.value = "";

  // Show temporary AI message
  addMessage("Thinking...", "ai");

  try {
    const response = await fetch(VERCEL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        session_id: sessionId
      }),
    });

    const data = await response.json();

    // Remove "Thinking..."
    const thinkingMsg = document.querySelector(".message.ai:last-child");
    if (thinkingMsg) thinkingMsg.remove();

    // Get AI response
    const aiText = data.reply || "No response from AI";

    addMessage(aiText, "ai");
  } catch (err) {
    console.error("Fetch error:", err);
    addMessage("Error contacting AI server.", "ai");
  }
}

// --- Event listeners ---
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
