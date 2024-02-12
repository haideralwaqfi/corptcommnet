const counterEl = document.querySelector(".counter");
const textareaEl = document.querySelector(".form__textarea");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");

//Constants
const MAX_LENGTH = 150;
const MIN_TEXT_LENGTH = 5;

//Defaults Settings
textareaEl.maxLength = MAX_LENGTH;
counterEl.textContent = MAX_LENGTH;
//Events Settings
textareaEl.addEventListener("keyup", (e) => {
  counterEl.textContent = MAX_LENGTH - textareaEl.value.length;
});

// -- FORM COMPONENT--

const showVisualIndicator = (textCheck) => {
  const className = textCheck === "valid" ? "form--valid" : "form--invalid";
  formEl.classList.add(className);

  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
};
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textareaEl.value;

  // validation
  if (text.includes("#") && text.length >= MIN_TEXT_LENGTH) {
    showVisualIndicator("valid");
  } else {
    showVisualIndicator("invalid");
    // stop app execution
    return;
  }

  // we have text
  const hashtag = text.split(" ").find((word) => word.includes("#"));
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  //new feedback item HTML
  const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${
              daysAgo === 0 ? "NEW" : `${daysAgo}d`
            }</p>
        </li>`;

  // insert the feedback
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
  textareaEl.value = "";
  submitBtnEl.blur();
  counterEl.textContent = MAX_LENGTH;
});
