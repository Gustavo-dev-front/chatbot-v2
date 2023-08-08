const CHAT_TOGGLER = document.querySelector("#container-toggler");
const BTN_CLOSE_MOBILE = document.querySelector("#title i");
const INPUT_BOX = document.querySelector("#input-box");
const INPUT = INPUT_BOX.querySelector("textarea");
const SEND_BTN = INPUT_BOX.querySelector("button");
const CHAT_BOX = document.querySelector("#chat-box");

const toggleChat = () => {
  document.body.classList.toggle("show-container");
};

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

const enterMessage = () => {
  const INPUT_VALUE = INPUT.value;
  if (INPUT_VALUE) {
    INPUT.value = "";

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
