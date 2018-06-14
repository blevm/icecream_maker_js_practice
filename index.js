document.addEventListener("DOMContentLoaded", function(event) {
  const main = document.querySelector("main")
  const ingredientsURL = `http://localhost:3000/ingredients`
  const iceCreamURL = 'http://localhost:3000/ice_creams'
  const ingredientsInForm = document.getElementById('list-of-ingredients')
  const newIceCreamForm = document.querySelector('form')
  let store;

  function fetchMachine(url) {
   return fetch(url).then(resp => resp.json())
  }

  function fetchIceCreams() {
    fetchMachine(iceCreamURL).then(data => displayIceCreams(data))
  }

  // function fetchIceCreams() {
  //   fetch(iceCreamURL).then(resp => resp.json()).then(data => fetchIngredients(data))
  // }

  function fetchAllIngredients() {
    return fetch(ingredientsURL).then(resp => resp.json())//.then(data => arrayAllIngredients(data))
  }

  function fetchIngredients(ingredientsArray) {

    return ingredientsArray.forEach( function(ing) {
      url = `${ingredientsURL}/${ing}`
      // console.log(url)
      fetch(url).then(resp => resp.json()).then(data => displayExistingIngredient(data))
      })
    // debugger
    // console.log(arr)
    // return arr
  }

////<li>Chcolate Fudge<button class="release" data-ingredient-id="140">Remove</button></li>

  function displayIceCreams(data) {

    data.forEach(function(icecream) {
      main.innerHTML +=
      `<div class="card" data-ice-cream-id="${icecream.id}"><p>${icecream.name}</p>
        <ul data-ice-cream-id="${icecream.id}">
          ${selectIngredients(icecream.ingredients)}
        </ul>
        <button data-ice-cream-id="${icecream.id}">Delete Ice Cream</button>
      </div>`
    })
  }

  function arrayAllIngredients(ings) {
    store = []
    store.push(ings.map( function(ing) {
       return displayExistingIngredient(ing)
    }))
    return fetchIceCreams()
  }

  function displayExistingIngredient(ing) {
    return `<li>${ing.name}<button class="release" data-ingredient-id="${ing.id}">Remove</button></li>`
  }

  function selectIngredients(ings) {
    const arr = []
    ings.forEach( function(ing, i) {
      // debugger
      // let difference;
      // if (ing >= i) {
      //   // debugger
      //   difference = ing - i
      // } else {
      //   difference = i - ing
      // }
      arr.push(store[0].find(function(li) {return li.includes(`data-ingredient-id="${ing}"`)})) })
    console.log(arr)
    return arr.join('')
  }

document.addEventListener('click', function(event) {
  event.preventDefault()
  if (event.target.className === 'release') {
    deleteAnIngredient(event.target.dataset.ingredientId)
  } else if (event.target.innerText === 'Delete Ice Cream') {
    deleteAnIceCream(event.target.dataset.iceCreamId)
  }
})

function deleteAnIceCream(id) {
  let url = `${iceCreamURL}/${id}`
  let config = {method: 'DELETE'}
  fetch(url, config).then(fetchAllIngredients).then(loadIndex)
}

function deleteAnIngredient(id) {
  let url = `${ingredientsURL}/${id}`
  let config = {method: 'DELETE'}
  fetch(url, config).then(fetchAllIngredients).then(loadIndex)
}

function loadIndex(ingObjs) {
  main.innerHTML = ""
  displayNewIceCreamForm(ingObjs)
  arrayAllIngredients(ingObjs)
  // fetchIceCreams()
}

function displayNewIceCreamForm(allIngs) {
  ingredientsInForm.innerHTML = ''
  allIngs.forEach(ing => ingredientsInForm.innerHTML += `<input id="${ing.id}" type="checkbox"><label for="${ing.id}">${ing.name}</label>&nbsp;&nbsp;&nbsp;`)
}

newIceCreamForm.addEventListener('submit', function(e) {
  e.preventDefault()
  let checkboxes = document.getElementById('list-of-ingredients').children
  let iceCreamName = document.getElementById('ice-cream-name')
  let ingredientName = document.getElementById('new-ingredient-name')

  if (ingredientName.value !== "") {
    const config = {method: 'POST',
        headers: {'Content-type':'application/json', 'Data-type':'application/json'},
        body: JSON.stringify({name: ingredientName.value})}
    ingredientName.value = ''
    fetch(ingredientsURL, config).then(fetchAllIngredients).then(loadIndex)
  } else {
    const ingArray = []
    Array.from(checkboxes).map(function(input) {if (input.checked === true) {ingArray.push(parseInt(input.id))}})
    const config2 = {method: 'POST',
        headers: {'Content-type':'application/json', 'Data-type':'application/json'},
        body: JSON.stringify({name: iceCreamName.value, ingredients: ingArray})}
    iceCreamName.value = ''
    fetch(iceCreamURL, config2).then(fetchAllIngredients).then(loadIndex)
  }
})

fetchAllIngredients().then(loadIndex)


});
