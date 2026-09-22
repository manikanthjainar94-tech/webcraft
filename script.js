/* =========================================================
   WEBCRAFT STUDIO — INTERACTION SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button") || document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  /* ---------------------------------------------------------
     Header scroll state
     --------------------------------------------------------- */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.classList.toggle("active", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
    });

    // Close menu after clicking a navigation link
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------------------------------------------------------
     Smooth scrolling
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal
     Works with any element that has class="reveal"
     --------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ---------------------------------------------------------
     Active navigation link
     Highlights the section currently in view
     --------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(
    '.site-header a[href^="#"], .mobile-nav a[href^="#"]'
  );

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------
     Subtle browser mockup movement
     --------------------------------------------------------- */
  const browser = document.querySelector(".browser-frame");

  if (browser && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");

    if (hero) {
      hero.addEventListener("mousemove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        browser.style.setProperty("--mouse-x", `${x * 8}deg`);
        browser.style.setProperty("--mouse-y", `${y * -5}deg`);
      });

      hero.addEventListener("mouseleave", () => {
        browser.style.setProperty("--mouse-x", "0deg");
        browser.style.setProperty("--mouse-y", "0deg");
      });
    }
  }

  /* ---------------------------------------------------------
     Current year
     Add <span data-year></span> anywhere in the footer
     --------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------
     Escape key closes mobile navigation
     --------------------------------------------------------- */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (mobileNav) mobileNav.classList.remove("open");
    if (menuButton) {
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("nav-open");
  });
});
