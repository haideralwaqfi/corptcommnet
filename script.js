const counterEl = document.querySelector(".counter");
const textareaEl = document.querySelector(".form__textarea");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const hashtagListEl = document.querySelector(".hashtags");
const submitBtnEl = document.querySelector(".submit-btn");
const BASE_URL = "https://bytegrad.com/course-assets/js/1/api";

//Constants
const MAX_LENGTH = 150;
const MIN_TEXT_LENGTH = 5;

// components
const renderFeedbackItem = (feedbackItem) => {
  const feedbackItemHTML = `
  <li class="feedback">
      <button class="upvote">
          <i class="fa-solid fa-caret-up upvote__icon"></i>
          <span class="upvote__count">${feedbackItem.upvoteCount}</span>
      </button>
      <section class="feedback__badge">
          <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
      </section>
      <div class="feedback__content">
          <p class="feedback__company">${feedbackItem.company}</p>
          <p class="feedback__text">${feedbackItem.text}</p>
      </div>
      <p class="feedback__date">${
        feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
      }</p>
  </li>`;

  // insert the feedback
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
};

//Defaults Settings
textareaEl.maxLength = MAX_LENGTH;
counterEl.textContent = MAX_LENGTH;
//Events Settings
textareaEl.addEventListener("keyup", (e) => {
  counterEl.textContent = MAX_LENGTH - textareaEl.value.length;
});

// -- FORM COMPONENT--
(() => {
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
    const feedbackItem = {
      upvoteCount,
      badgeLetter,
      company,
      text,
      daysAgo,
    };
    renderFeedbackItem(feedbackItem);

    //send feedback to the server
    fetch(`${BASE_URL}/feedbacks`, {
      method: "POST",
      body: JSON.stringify(feedbackItem),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("something went wrong");
          return;
        }
        console.log("Successfully submitted feedback");
      })
      .catch((err) => console.log(err));

    textareaEl.value = "";
    submitBtnEl.blur();
    counterEl.textContent = MAX_LENGTH;
  });
})();

// -- FEEDBACK FETCH --
(() => {
  const clickHandler = (e) => {
    const clickedEl = e.target;

    const upvoteIntention = clickedEl.className.includes("upvote");
    if (upvoteIntention) {
      const upvoteBtnEl = clickedEl.closest(".upvote");
      upvoteBtnEl.disabled = true;

      let upvoteCount = parseInt(
        upvoteBtnEl.querySelector(".upvote__count").textContent
      );

      upvoteBtnEl.textContent = ++upvoteCount;
    } else {
      clickedEl.closest(".feedback").classList.toggle("feedback--expand");
    }
  };

  feedbackListEl.addEventListener("click", clickHandler);

  fetch(`${BASE_URL}/feedbacks`)
    .then((res) => res.json())
    .then((data) => {
      data.feedbacks.forEach((feedbackItem) => {
        renderFeedbackItem(feedbackItem);
      });
      document.querySelector(".spinner").remove();
    })
    .catch((error) => {
      feedbackListEl.textContent = `Failed to fetch feedback items. error message: ${error}`;
    });
})();
(() => {
  const clickHandler = (e) => {
    const clickedEl = e.target;
    if (clickedEl.className === "hashtags") return;

    const companyNameFromHashtag = clickedEl.textContent
      .substring(1)
      .toLowerCase()
      .trim();

    feedbackListEl.childNodes.forEach((childNode) => {
      if (childNode.nodeType === 3) return;
      const companyNameFromFeedbackItem = childNode
        .querySelector(".feedback__company")
        .textContent.toLowerCase()
        .trim();

      if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
        childNode.remove();
      }
    });
  };

  hashtagListEl.addEventListener("click", clickHandler);
})();
