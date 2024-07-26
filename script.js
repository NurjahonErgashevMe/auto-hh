const coverLetterText = "Добрый день)!";

const withCoverLetter = [];
const alreadyResponded = [];

const addedToBlacklist = [];
const alreadyAddedToBlacklist = [];

const triggerInputChange = (node, value = "") => {
  const inputTypes = [
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
  ];

  // only process the change on elements we know have a value setter in their constructor
  if (inputTypes.indexOf(node.proto.constructor) > -1) {
    const setValue = Object.getOwnPropertyDescriptor(node.proto, "value").set;
    const event = new Event("input", { bubbles: true });

    setValue.call(node, value);
    node.dispatchEvent(event);
  }
};

const wait = (ms = 100) => new Promise((res) => setTimeout(res, ms));

const prevLoc = window.location.href;

navigation.addEventListener("navigate", (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  window.location.href = prevLoc;
});

Object.freeze(document.location);

const run = async () => {
  const items = document.querySelectorAll(".vacancy-search-item__card");
  for (const [index, item] of items.entries()) {
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    item.style.boxShadow = "0 0 5px red";

    const jobTitle = item.querySelector(".serp-item__title-link-wrapper")
      ?.innerText;
    const jobHref = item.querySelector(".serp-item__title-link-wrapper")?.href;

    const target = item.querySelector(
      "[data-qa=vacancy-serp__vacancy_response]"
    );

    if (["Respond", "Откликнуться"].includes(target?.innerText)) {
      target.click();
      await wait(2000);

      // Вы откликаетесь на вакансию в другой стране
      document
        .querySelector(".bloko-modal-footer .bloko-button_kind-success")
        ?.click();

      const coverLetter = document.querySelector(
        "[data-qa=vacancy-response-popup-form-letter-input]"
      );

      if (coverLetter) {
        triggerInputChange(coverLetter, coverLetterText);

        withCoverLetter.push({ title: jobTitle, href: jobHref });
      }

      document
        .querySelector(".bloko-modal-footer .bloko-button_kind-primary")
        ?.click();

      await wait(1111);

      const errorText = document.querySelector(".vacancy-response-popup-error")
        ?.innerText;
      if (errorText) {
        document
          .querySelector("[data-qa=vacancy-response-popup-close-button]")
          ?.click();
        continue;
      }
    } else {
      alreadyResponded.push({ title: jobTitle, href: jobHref });
    }

    await wait(100);

    const blacklist = item.querySelector(
      "[data-qa=vacancy__blacklist-show-add]"
    );

    if (blacklist) {
      blacklist.click();
      await wait(100);
      document
        .querySelector("[data-qa=vacancy__blacklist-menu-add-vacancy]")
        .click();

      addedToBlacklist.push({ title: jobTitle, href: jobHref });
    } else {
      alreadyAddedToBlacklist.push({ title: jobTitle, href: jobHref });
    }

    await wait(1000);
    item.style.boxShadow = "";
  }

  const next = document.querySelector('[data-qa="pager-next"]');
  if (next) {
    next.click();
    await wait(4000);
    run();
  }
};

run();
