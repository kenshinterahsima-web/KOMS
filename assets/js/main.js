const header = document.querySelector(".site-header");

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealSelectors = [
  ".empathy__title-image",
  ".empathy__title",
  ".empathy-season__heading",
  ".empathy-card",
  ".problem__panel",
  ".solution__heading",
  ".solution-block__text",
  ".solution-block__image",
  ".cta-section__inner",
  ".material__heading",
  ".material__lead",
  ".material-card",
  ".material__note",
  ".compare__heading",
  ".compare-card",
  ".voice__heading",
  ".voice-card",
  ".process__heading",
  ".process-list li",
  ".contact-form__heading",
  ".contact-form__body",
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      // 同じグループ内で少しだけ時間差をつける（最大0.3s）
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 0.1}s`);
      revealObserver.observe(element);
    });
  });
}

const contactForm = document.querySelector(".contact-form__body");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(".contact-form__submit");
    submitButton.disabled = true;
    submitButton.textContent = "送信中…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`送信に失敗しました (${response.status})`);

      window.location.href = "thanks.html";
    } catch (error) {
      alert("送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お電話にてご連絡ください。");
      submitButton.disabled = false;
      submitButton.textContent = "送信する";
    }
  });
}
