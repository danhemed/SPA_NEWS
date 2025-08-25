const main = document.getElementById("main");
const header = document.querySelector("header");

const nav = document.createElement("nav");
header.appendChild(nav);

const a1 = document.createElement("a");
const a2 = document.createElement("a");

a1.textContent = "Home";
a2.textContent = "Create News";

nav.appendChild(a1);
nav.appendChild(a2);

const h2 = document.createElement("h2");
h2.textContent = "Home";
header.appendChild(h2);

let currentRoute = null;

async function getCard() {
  const container = document.createElement("div");
  container.className = "cards";

  const cached = localStorage.getItem("articles");
  let newCard  = null;
  newCard = localStorage.getItem("newCard");
  console.log(newCard);
  let data;

  if (cached) {
    console.log(`localStorage`);
    data = JSON.parse(cached);
  } else {
    try {
      const res = await fetch("http://localhost:3003/news");
      data = await res.json();
      localStorage.setItem("articles", JSON.stringify(data));
    } catch (err) {
      console.log(err);
      return container;
    }
  }

  if (newCard) {
    newCard = JSON.parse(newCard);
    data.articles.push(...newCard);
  }

  data.articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = article.author;
    card.appendChild(h3);

    const h4 = document.createElement("h4");
    h4.textContent = article.title;
    card.appendChild(h4);

    const containerImg = document.createElement("div");
    containerImg.className = "containerImg";
    card.appendChild(containerImg);

    const img = document.createElement("img");
    img.src = article.urlToImage;
    containerImg.appendChild(img);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const moveX = (e.clientX - rect.left - rect.width / 2) * 0.05;
      const moveY = (e.clientY - rect.top - rect.height / 2) * 0.05;
      card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translate(0, 0) scale(1)";
    });

    card.addEventListener("click", () => {
      currentRoute = article.author;
      h2.innerHTML = article.author;
      const page = document.createElement("section");
      page.className = "new_page";
      const description = document.createElement("h5");
      description.textContent =
        article.description || "No description available.";
      page.appendChild(description);

      const content = document.createElement("p");
      content.textContent = article.content || "No content available.";
      page.appendChild(content);

      const readMore = document.createElement("a");
      readMore.href = article.url;
      readMore.target = "_blank";
      readMore.textContent = "Read more";
      readMore.className = "read_more";
      page.appendChild(readMore);

      const newimg = document.createElement("img");
      newimg.src = article.urlToImage;
      page.appendChild(newimg);

      main.innerHTML = "";
      main.appendChild(page);
    });

    container.appendChild(card);
  });

  return container;
}

function createNews() {
  const form = document.createElement("form");
  form.id = "formCreateNews";

  const labelAuthor = document.createElement("label");
  labelAuthor.textContent = "Enter Author:";
  labelAuthor.htmlFor = "Author";

  const inputAuthor = document.createElement("input");
  inputAuthor.type = "text";
  inputAuthor.name = "Author";

  const labelTitle = document.createElement("label");
  labelTitle.textContent = "Enter Title:";
  labelTitle.htmlFor = "Title";

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.name = "Title";

  const labelDescription = document.createElement("label");
  labelDescription.textContent = "Enter Description:";
  labelDescription.htmlFor = "Description";

  const inputDescription = document.createElement("input");
  inputDescription.type = "text";
  inputDescription.name = "Description";

  const labelContent = document.createElement("label");
  labelContent.textContent = "Enter Content:";
  labelContent.htmlFor = "Content";

  const inputContent = document.createElement("input");
  inputContent.type = "text";
  inputContent.name = "Content";

  const labelImg = document.createElement("label");
  labelImg.textContent = "Enter Img:";
  labelImg.htmlFor = "urlToImage";

  const inputImg = document.createElement("input");
  inputImg.type = "file";
  inputImg.name = "urlToImage";

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Submit";

  form.appendChild(labelAuthor);
  form.appendChild(document.createElement("br"));
  form.appendChild(inputAuthor);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelTitle);
  form.appendChild(document.createElement("br"));
  form.appendChild(inputTitle);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelDescription);
  form.appendChild(document.createElement("br"));
  form.appendChild(inputDescription);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelContent);
  form.appendChild(document.createElement("br"));
  form.appendChild(inputContent);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelImg);
  form.appendChild(document.createElement("br"));
  form.appendChild(inputImg);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newItem = {
      author: inputAuthor.value,
      title: inputTitle.value,
      description: inputDescription.value,
      content: inputContent.value,
      urlToImage: URL.createObjectURL(inputImg.files[0]),
      date: new Date().toISOString(),
    };

    const savedNews = JSON.parse(localStorage.getItem("news")) || [];
    savedNews.push(newItem);

    localStorage.setItem("newCard", JSON.stringify(savedNews));

    window.alert("The form added to the news");

    form.reset();
  });

  return form;
}

function loadPage(route, page) {
  main.innerHTML = "";
  if (route === "home") {
    main.appendChild(page);
    currentRoute = route;
  }
  if (route === "create_news") {
    main.appendChild(page);
    currentRoute = route;
  }
}

a1.addEventListener("click", async () => {
  if (currentRoute === "home") return;
  const page = document.createElement("section");
  page.classList.add("page_home");
  page.classList.add("page");
  h2.innerHTML = "Home";
  const cards = await getCard();
  page.appendChild(cards);
  loadPage("home", page);
});

a2.addEventListener("click", async () => {
  const fullForm = document.getElementById("formCreateNews");
  console.log(fullForm);
  if (currentRoute === "create_news") return;
  const page = document.createElement("section");
  page.classList.add("page_create_news");
  page.classList.add("page");
  h2.innerHTML = "Create News";
  const create_news = createNews();
  page.appendChild(create_news);
  loadPage("create_news", page);
});
