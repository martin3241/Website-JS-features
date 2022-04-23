'use strict';


const btnScrollTo = document.querySelector('.btn--scroll-to')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1')
const nav = document.querySelector('.nav')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////



// ***PAGE NAVIGATION***

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()

  section1.scrollIntoView({ behaviour: 'smooth' })
})

// Add event listener to parent element.
// Determine what element started the event

// Instead of attaching a link to every button, I made a more replicable function 

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // No need to have the default href function involved
  e.preventDefault()

  // This helps me understand where the event happened
  // console.log(e.target)
  // If you use the previous console.log, you will see that if you click on a certain element, the target will show up. I will use this knowledge in order to creating a match between the place where the person clicks and where the person should go
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })

  }

})



document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id)
    document.querySelector(id).scrollIntoView({ behaviour: 'smooth' })

  })
})

// ***TEXTS IN DIFFERENT TABS***

// I would use an event on each of the tabs like this, but it would be bad practice if there would be 200 tabs, it would slow down the website:

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')))

// Instead, I will use the tabs container (since there is only one) and from there, figure out where the click happened.
tabsContainer.addEventListener('click', function (e) {
  // const clickedChild = e.target;
  // console.log(clickedChild)

  // Using the two lines above, i found out that the button-areas are called "<span>01(-03)</span>"

  // const clickedParent = e.target.parentElement
  // console.log(clickedParent)

  // By using these two lines, I can see that if I click the button and not the button-text, the parent will be the entire area. I need to make sure that wherever the user clicks on the button, the click is being registered as a click on the actual button element so that I can attach a function to that element.
  const clicked = e.target.closest('.operations__tab')
  // console.log(clicked)
  // Guard clause - If you click on the box containing the buttons but not directly on the buttons, then nothing shoud happen
  if (!clicked) return
  // In other words, if you get a null, finish this function

  // I want all the tabs to be inactive (lower them) before I activate the one that the user clicked on
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  // I also want to remove the content that is being shown in that area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))

  // if the above line is executed, the following wont be
  clicked.classList.add('operations__tab--active');


  // Now that one tap is pulled up, lets activate the right piece of content corresponding to the raised tab. The value that indicates where the cliced happened was stored in the variable "clicked"
  // console.log(clicked.dataset.tab)
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// ***MENU FADE-IN ANIMATION***

const handleHover = function (e, opacity) {
  // I am not using the "closest"-method here because there are no child-elements that the user can accidentally click. 
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // I now have to select all the siblings in the nav-bar. Each nav-link has a class called nav__item.
    // Here I am searching for the closest parent, from which I will search for the nav links (they will be the siblings)
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // Lets do the same on the logo
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      // I first need to check that the sibiling is NOT the one that the user clicked on, then I will change the opacity
      if (el !== link) el.style.opacity = opacity;
    });
    // Same goes with the logo
    logo.style.opacity = opacity;
  }
}
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.1);
})
// Creating this effect is cool but we dont want it to stay after the mouse stopped hovering over it
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
})

// ***STICKY NAVIGATION***

const initialCoords = section1.getBoundingClientRect()

window.addEventListener('scroll', function (e) {
  // Im using this function to measure after how much scrolling the sticky nav should start
  // console.log(window.scrollY)
  // I realised that I cant hardcode where the sticky nav must start so it will be have to be a dynamic point
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky')
})


// ***REVEAL SECTION*** (ref nr 189 in notes)
// At the moment of writing, all the sections have the opacity 0 because I want them to fade in and move up a bit while the user scroll down. I have to remove the class ("section--hidden") at the moment a user has scrolled down to the corresponding section.

const allSections = document.querySelectorAll('.section')
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})


// ***LAZY LOADING IMAGES***
// I dont want to focus on ALL images (for example the small logo and favicon), so I target images that have a source to a larger image
const imgTargets = document.querySelectorAll('img[data-src]')

// Creating a callback function. This is where our functionality is 
const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard clause. If the view port is not intersecting, then we want a simple return
  if (!entry.isIntersecting) return

  // Otherwise we want to replace the placeholder image with with data-src image
  // entry.target means the entry that is currently being intersected
  // entry.target.dataset is where the special data-properties are stored 
  entry.target.src = entry.target.dataset.src;
  // The small image is now replaced with the big one but the image is still blurry, thats because the image still has the lazy image class that blurs the image, I have to remove it

  // entry.target.classList.remove('lazy-img')
  // After using the above command (that removes the lazy image class), I noticed that the images were still loading after the removal of the class. Thats why I will make sure to remove the class AFTER it has been loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })
  // Now that its done, lets stop observing
  observer.unobserve(entry.target)
}

// Im attaching this image observer so that when a user crosses its threshold, the image will load
const imgObserver = new IntersectionObserver(loadImg, {
  // These are the options, root always has to be mentioned
  root: null,
  // null means set to the entire viewport
  threshold: 0,
  rootMargin: '200px'
})
// Here, Im simply calling the function on each image, putting the last variables together
imgTargets.forEach(img => imgObserver.observe(img))


// *** SLIDING IMAGES***
// Selecting all slides
const slides = document.querySelectorAll('.slide')
// Lets define and later remove the buttons (they are currently stuck to the first image)
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots')
let curSlide = 0
// JS doesn't know when to stop sliding, thats why I have set the total amount of slides is the max length of the slides
const maxSlide = slides.length

// CREATING DOTS
const createDots = function () {
  slides
    .forEach(function (_, i) {
      dotContainer
        .insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
}
createDots()

// The active dot should be darker
const activateDot = function (slide) {
  // I am removing the active class on all the elements 
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList
      .remove('dots__dot--active'))
  // I am adding the active class on the current slide-dot 
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`).classList
    .add('dots__dot--active')
}
// I want the first dot to be active when you arrive on the page
activateDot(0)

// Putting all slides beside each other (any slide that is not in the right spot will be place on the right or left of the current slide but will be invisible)
// .transform means transform property that I want to set
// The first slide should be 0% transformed (we dont want to move that one), the second at 100% and so on. They will be moved 100% of its width


// I want to see if the slides are really next to each other 
// const slider = document.querySelector('.slider')
// slider.style.transform = 'scale(0.4) translateX (-800px)'
// slider.style.overflow = 'visible'

const goToSlide = function (slide) {
  slides.forEach(
    // curSlide = 1. index starts  at 0
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  )
}

// We want the user to always start with the same slide. After that, the function will adapt to the current slide
goToSlide(0)

// Next slide = change the % in the positioning of the slides. They have to move 100% to the right or left. The current slide will have 0%, the one to the left will have translateX -100% and the one to the right (+)100%. That is why I wrote "let curSlide = 0"

const nextSlide = function () {
  // This is how you can make the slides seem to go in a circle
  if (curSlide === maxSlide - 1) {
    curSlide = 0
  } else {
    curSlide++
  }

  goToSlide(curSlide)
  activateDot(curSlide)
}

const prevSlide = function () {
  if (curSlide === 0) {
    // -1 because it is not 0 based like an array
    curSlide = maxSlide - 1
  } else {
    curSlide--
  }
  goToSlide(curSlide)
  activateDot(curSlide)
}
btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function (e) {
  // Using the following command, I will find out the name of the right/left arrow event (and later attach it to the slider)
  // console.log(e)
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
})

// Going to the selected slide
dotContainer.addEventListener('click', function (e) {
  // I am adding a function to an element inside the dot container that has the class of a dot
  if (e.target.classList.contains('dots__dot')) {
    // In the section called "CREATING THE DOTS", notice the html: "data-slide="${i}", thats what I am refering to here
    const slide = e.target.dataset.slide
    goToSlide(slide)
    activateDot(slide)
  }
})