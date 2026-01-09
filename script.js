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

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
// --- Backend URL ---
const VERCEL_API_URL = "https://chat-box-dun.vercel.app/api/chat";

// --- Send message function ---
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // IMAGE MODE
  if (text.startsWith("/image")) {
    const prompt = text.replace("/image", "").trim();

    if (!prompt) {
      addMessage("Please provide an image prompt.", "ai");
      return;
    }

    addMessage("Generating image...", "ai");

    try {
      const response = await fetch(
        "https://chat-box-dun.vercel.app/api/image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        }
      );

      const data = await response.json();
      console.log("IMAGE API RESPONSE:", data);


      // Remove "Generating image..."
      const thinkingMsg = document.querySelector(".message.ai:last-child");
      if (thinkingMsg) thinkingMsg.remove();

      addImage(data.image);

    } catch (err) {
      console.error(err);
      addMessage("Image generation failed.", "ai");
    }

    return;
  }

  // CHAT MODE (normal text)
  addMessage("Thinking...", "ai");

  try {
    const response = await fetch(
      "https://chat-box-dun.vercel.app/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId
        })
      }
    );

    const data = await response.json();

    const thinkingMsg = document.querySelector(".message.ai:last-child");
    if (thinkingMsg) thinkingMsg.remove();

    addMessage(data.reply, "ai");

  } catch (err) {
    console.error(err);
    addMessage("Error contacting AI server.", "ai");
  }
}

// --- Event listeners ---
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addImage(base64Image) {
  const img = document.createElement("img");
  img.src = base64Image;
  img.className = "message ai image";
  chatMessages.appendChild(img);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
