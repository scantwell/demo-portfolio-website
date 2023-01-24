(function (app) {
  'use strict';

  app.portfolioItems = [];
  app.selectedItem = {};

  app.homepage = function () {
    setCopyrightDate();
    wireContactForm();
  };

  app.portfolio = async function () {
    setCopyrightDate();
    await loadPageData();
    loadMenuItems();
    loadPortfolioData();
  };

  app.workItem = async function () {
    setCopyrightDate();
    await loadPageData();
    loadMenuItems();
    loadSpecificItem();
    updateItemPage();
  };

  function loadMenuItems() {
    const originalItems = document.querySelectorAll('.work-item-nav');
    const nav = document.querySelector('nav ul');

    originalItems.forEach((el) => el.remove());
    for (let i = 0; i < app.portfolioItems.length; i++) {
      const li = document.createElement('li');
      li.classList.add('work-item-nav');
      const a = document.createElement('a');
      a.href = `workitem.html?item=${i + 1}`;
      a.innerHTML = `Item #${i + 1}`;
      li.appendChild(a);
      nav.appendChild(li);
    }
  }

  function wireContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.onsubmit = contactFormSubmit;
  }

  function contactFormSubmit(e) {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    const name = contactForm.querySelector('#firstName');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');
    const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`;
    window.open(mailTo);
    form.reset();
  }

  function loadPortfolioData() {
    const originalItems = document.querySelectorAll('.highlight');
    const main = document.getElementById('portfolio-main');
    const newItems = [];

    for (let i = 0; i < app.portfolioItems.length; i++) {
      const el = app.portfolioItems[i];
      const highlight = document.createElement('div');
      highlight.classList.add('highlight');
      if (i % 2 > 0) {
        highlight.classList.add('invert');
      }

      const textDiv = document.createElement('div');
      const h2 = document.createElement('h2');
      const a = document.createElement('a');

      h2.innerHTML = `0${i + 1}. ${el.title.replaceAll(' ', '<br/>')}`;
      a.href = `workitem.html?item=${i + 1}`;
      a.innerHTML = 'see more';

      textDiv.appendChild(h2);
      textDiv.appendChild(a);
      highlight.appendChild(textDiv);

      const image = document.createElement('img');
      image.src = el.smallImage;
      image.alt = el.smallImageAlt;

      highlight.appendChild(image);
      newItems.push(highlight);
    }

    originalItems.forEach((el) => el.remove());
    newItems.forEach((el) => main.appendChild(el));
  }

  async function loadPageData() {
    const cacheData = sessionStorage.getItem('site-data');
    if (cacheData !== null) {
      app.portfolioItems = JSON.parse(cacheData);
    } else {
      const rawData = await fetch('../data.json');
      const data = await rawData.json();
      app.portfolioItems = data;
      sessionStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadSpecificItem() {
    const params = new URLSearchParams(window.location.search);
    let item = Number.parseInt(params.get('item'));
    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }
    app.selectedItem = app.portfolioItems[item - 1];
    app.selectedItem.id = item;
  }

  function updateItemPage() {
    const header = document.getElementById('work-item-header');
    header.innerHTML = `0${app.selectedItem.id}. ${app.selectedItem.title}`;

    const image = document.getElementById('work-item-img');
    image.src = app.selectedItem.largeImage;
    image.alt = app.selectedItem.largeImageAlt;

    const projectText = document.querySelector('#project-text p');
    projectText.textContent = app.selectedItem.projectText;

    const originalTechList = document.querySelector('#technologies-text ul');
    const technologySection = document.getElementById('technologies-text');
    const ul = document.createElement('ul');

    app.selectedItem.technologies.forEach((el) => {
      const li = document.createElement('li');
      li.innerText = el;
      ul.appendChild(li);
    });

    originalTechList.remove();
    technologySection.appendChild(ul);

    const challengesText = document.querySelector('#challenges-text p');
    challengesText.textContent = app.selectedItem.challengesText;
  }

  function setCopyrightDate() {
    const date = new Date();
    document.getElementById('copyrightYear').innerHTML = date.getFullYear();
  }
})((window.app = window.app || {}));
