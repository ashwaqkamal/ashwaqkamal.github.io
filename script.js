/*
======================================================
Ashwaq Kamal
Professional Teaching Portfolio
Version 2.0
======================================================
*/


/* =====================================================
   Smooth Scrolling Navigation
===================================================== */

document.querySelectorAll('nav a').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        const href = this.getAttribute('href');

        if (!href.startsWith('#')) return;

        e.preventDefault();

        document.querySelector(href).scrollIntoView({

            behavior: 'smooth'

        });

    });

});



/* =====================================================
   Sticky Header Shadow
===================================================== */

const header = document.getElementById('header');

window.addEventListener('scroll', () => {

    if (window.scrollY > 40) {

        header.style.boxShadow =
            '0 8px 25px rgba(0,0,0,.08)';

    }

    else {

        header.style.boxShadow = 'none';

    }

});



/* =====================================================
   Back To Top Button
===================================================== */

const backToTop =
document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.style.opacity = "1";

        backToTop.style.visibility = "visible";

    }

    else {

        backToTop.style.opacity = "0";

        backToTop.style.visibility = "hidden";

    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});
/* =====================================================
   Active Navigation Highlight
===================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

function highlightNavigation() {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === "#" + current) {

            link.classList.add("active");

        }

    });

}

window.addEventListener("scroll", highlightNavigation);



/* =====================================================
   Fade In Sections
===================================================== */

const observer = new IntersectionObserver(

(entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

},

{
    threshold:0.15
}

);

document.querySelectorAll(

".highlight-card, \
.education-card, \
.skill-card, \
.timeline-item, \
.project-card, \
.document-card, \
.contact-card"

).forEach(card => {

    card.classList.add("hidden");

    observer.observe(card);

});



/* =====================================================
   Accessibility
===================================================== */

const prefersReducedMotion =
window.matchMedia("(prefers-reduced-motion: reduce)");

if(prefersReducedMotion.matches){

    document.documentElement.style.scrollBehavior="auto";

}



/* =====================================================
   Current Year (Future Proof)
===================================================== */

const yearElement = document.querySelector(".copyright p");

if(yearElement){

    yearElement.innerHTML =
        `© ${new Date().getFullYear()} Ashwaq Kamal. All Rights Reserved.`;

}



/* =====================================================
   Loading Animation
===================================================== */

window.addEventListener("load",()=>{

    document.body.classList.add("loaded");

});



/* =====================================================
   End
===================================================== */
