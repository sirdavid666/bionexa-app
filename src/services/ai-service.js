
const AI_ENDPOINT =
  "https://bionexa-ai.olujinmiewaoluwa.workers.dev/";

export async function askAI(message, history = []) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Please enter a question.");
  }

  const messages = [
    ...history,
    {
      role: "user",
      content: message.trim()
    }
  ];

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("The AI server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.error || "The AI service is temporarily unavailable."
      );
    }

    if (!data.answer) {
      throw new Error("The AI did not return an answer.");
    }

    return {
      answer: data.answer,
      model: data.model || "Gemini"
    };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect. Check your internet connection and try again."
      );
    }

    throw error;
  }
}

export function checkAIConnection() {
  return fetch(AI_ENDPOINT, {
    method: "GET"
  }).then(response => response.ok || response.status === 405);
}
