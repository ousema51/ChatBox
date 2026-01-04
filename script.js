async function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  input.value = "";

  addMessage("Thinking...", "ai");

  try {
    const VERCEL_API_URL = "https://chat-box-dun.vercel.app/api/chat";

    const response = await fetch(VERCEL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    // Remove "Thinking..."
    document.querySelector(".message.ai:last-child")?.remove();

    const aiText =
      data.choices?.[0]?.message?.content || "No response from AI";

    addMessage(aiText, "ai");
  } catch (err) {
    console.error(err);
    addMessage("Error contacting AI server.", "ai");
  }
}
