const CHAT_TOGGLER = document.querySelector("#container-toggler");
const BTN_CLOSE_MOBILE = document.querySelector("#title i");
const INPUT_BOX = document.querySelector("#input-box");
const INPUT = INPUT_BOX.querySelector("textarea");
const INPUT_INITIAL_SIZE = INPUT.scrollHeight;
const SEND_BTN = INPUT_BOX.querySelector("button");
const CHAT_BOX = document.querySelector("#chat-box");

// Função utilizada para mostrar e ocultar o container/chat
const toggleChat = () => {
  document.body.classList.toggle("show-container");
};

// Função utilizada para enviar a requisação à API da OPEN AI e usar a resposta no CHAT 
const generateResponse = async (INPUT_VALUE, LAST_BOT_MESSAGE) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "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";
  const API_OPTIONS = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${INPUT_VALUE}` }],
    }),
  };

  fetch(API_URL, API_OPTIONS)
    .then((response) => response.json())
    .then((response) => {
      LAST_BOT_MESSAGE.innerText = response.choices[0].message.content;
    })
    .catch((error) => {
      console.log(error);
      LAST_BOT_MESSAGE.classList.add("error");
      LAST_BOT_MESSAGE.innerText =
        "Oops! Parece que aconteceu um problema. Favor, tente novamente.";
    })
    .finally(() => CHAT_BOX.scrollTo(0, CHAT_BOX.scrollHeight));
};

// Função utilizada para criar uma mensagem no chat-box, para ambas as roles (user e bot)
const generateMessage = (INPUT_VALUE, role) => {
  const MESSAGE = document.createElement("li");
  const MESSAGE_VALUE = `<p>${INPUT_VALUE}</p>`;
  MESSAGE.classList.add("message", role);

  if (role === "bot")
    MESSAGE.innerHTML = `<i class="material-symbols-outlined">smart_toy</i>`;

  MESSAGE.innerHTML += MESSAGE_VALUE;
  CHAT_BOX.appendChild(MESSAGE);
  CHAT_BOX.scrollTo(0, CHAT_BOX.scrollHeight);
  return MESSAGE.querySelector("p");
};

// Função que valida a entrada e chama as demais funções
const enterMessage = () => {
  const INPUT_VALUE = INPUT.value.trim();
  if (INPUT_VALUE) {
    INPUT.value = "";
    INPUT.style.height = `${INPUT_INITIAL_SIZE}px`;

    generateMessage(INPUT_VALUE, "user");

    setTimeout(() => {
      const BOT_TYPING = "Digitando...";
      const LAST_BOT_MESSAGE = generateMessage(BOT_TYPING, "bot");
      generateResponse(INPUT_VALUE, LAST_BOT_MESSAGE);
    }, 600);
  }
};

SEND_BTN.addEventListener("click", enterMessage);
CHAT_TOGGLER.addEventListener("click", toggleChat);
BTN_CLOSE_MOBILE.addEventListener("click", toggleChat);

// Função que permite o envio do input pela tecla Enter
INPUT.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && !e.shiftKey) enterMessage();
});

// Função de resize do textarea com base no contéudo inserido, respeitando o max-height definido no CSS
INPUT.addEventListener("input", () => {
  INPUT.style.height = `${INPUT_INITIAL_SIZE}px`;
  INPUT.style.height = `${INPUT.scrollHeight}px`;
});
