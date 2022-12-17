/* To change the direction ---------------------------------------*/
const mainObject = document.querySelector("#mainContent");
const footerObject = document.querySelector("#section-footer");

const observer = new MutationObserver((par) => {
  par.forEach((elem) => {
    if (elem.type === "attributes") {
      if (elem.target.getAttribute("lang") === "ar") {
        mainObject.setAttribute("dir", "rtl");
        footerObject.setAttribute("dir", "rtl");
        const pullet = document.querySelector(".pbp-points");
        pullet.classList.remove("text-left");
        pullet.classList.add("text-right");
        /*---------------------*/
        const sticky = document.querySelector(
          ".btn--sticky_addtocart .material-icons"
        );
        const sticky_btn = document.querySelector(
          ".btn--sticky_addtocart .btn-text-sticky_addtocart"
        );
        sticky.innerHTML = "contact_phone";
        sticky_btn.innerHTML = "تواصل معنا";
      } else {
        mainObject.setAttribute("dir", "ltr");
        footerObject.setAttribute("dir", "ltr");
        const pullet = document.querySelector(".pbp-points");
        pullet.classList.remove("text-right");
        pullet.classList.add("text-left");
        /*---------------------*/
        const sticky = document.querySelector(
          ".btn--sticky_addtocart .material-icons"
        );
        const sticky_btn = document.querySelector(
          ".btn--sticky_addtocart .btn-text-sticky_addtocart"
        );
        sticky.innerHTML = "contact_phone";
        sticky_btn.innerHTML = "Contact Us";
      }
    }
  });
});
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
/* To delete review app ---------------------------------------*/
const revObs = new MutationObserver(function () {
  if (
    document.querySelector(
      "#am-reviews-carousel-shadow-container-production"
    ) != null &&
    document.querySelector("body").id ==
      "professional-shopify-dropshipping-store"
  ) {
    document
      .querySelector("#am-reviews-carousel-shadow-container-production")
      .remove();
    revObs.disconnect();
  }
});
const target = document.querySelector("body");
revObs.observe(target, {
  childList: true,
});

/* sticky add to cart mod ---------------------------------------*/

window.onload = function () {
  if (
    window.location.href ===
    "https://ultratech24.com/products/professional-shopify-dropshipping-store"
  ) {
    const sticky = document.querySelector(
      ".btn--sticky_addtocart .material-icons"
    );
    const sticky_btn = document.querySelector(
      ".btn--sticky_addtocart .btn-text-sticky_addtocart"
    );
    const sticky_btn1 = document.querySelector(".btn--sticky_addtocart");

    /* check the lang */
    if (document.documentElement.getAttribute("lang") === "en") {
    } else {
      sticky.innerHTML = "contact_phone";
      sticky_btn.innerHTML = "تواصل معنا";
    }

    sticky_btn1.type = "button";
    /* click event */
    sticky_btn1.addEventListener("click", (func) => {
      window.open(
        "https://ultratech24.com/pages/contact",
        "_self"
      );
    });
  }
};
