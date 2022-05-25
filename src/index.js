document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  const createToyForm = document.querySelector("form");
  createToyForm.addEventListener("submit", event => newToy(event));
  //GET to add everything
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(data => displayData(data))
});

let addToy = false;
const toysContainer = document.querySelector("#toy-collection");

class Toy {
  constructor(name, image) {
    this.name = name;
    this.image = image;
    this.likes = 0;
  }
}


function displayData(data) {
  for (let toy of data) {
    renderToy(toy);
  }
}

function renderToy(toy) {
  // Declaration
  let h2 = document.createElement("h2");
  let likes = document.createElement("p");
  let image = document.createElement("img");
  let toyContainer = document.createElement("div");
  let button = document.createElement("button");
  // Assignment
  likes.innerText = toy.likes;
  h2.innerText = toy.name;
  image.src = toy.image;
  button.innerText = "Like";
  // Styles
  image.classList.add("toy-avatar");
  toyContainer.classList.add("card");
  button.classList.add("like-btn");
  // Add event listener for likes
  button.addEventListener("click", (e) => likeToy(e));
  // Adding to page
  toyContainer.appendChild(h2);
  toyContainer.appendChild(image);
  toyContainer.appendChild(likes);
  toyContainer.appendChild(button);
  toyContainer.id = toy.id
  toysContainer.appendChild(toyContainer);
}

function likeToy(e) {
  let button = e.target;
  let id = Number(button.parentNode.id);
  let newLike = Number(button.previousSibling.innerText);
  newLike++;
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "likes": newLike,
    })
  })
    .then(res => res.json())
    .then(data => button.previousSibling.innerText = data.likes)
}

function newToy(event) {
  event.preventDefault();
  let toyName = event.target[0].value;
  let toyUrl = event.target[1].value;
  let toy = new Toy(toyName, toyUrl);
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body: JSON.stringify(toy),
  })
    .then(res => res.json())
    .then(data => renderToy(data))

}