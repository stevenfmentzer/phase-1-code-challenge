////GLOBAL VARIABLES

let currentCake
const cakeName = document.getElementById("cake-name")
const cakeImage = document.getElementById("cake-image")
const cakeDescription = document.getElementById("cake-description")
const descriptionForm = document.getElementById("description-form")
const descriptionTextArea = document.getElementById("description")
const reviewList = document.getElementById("review-list")
const reviewForm = document.getElementById("review-form")
const reviewInput = document.getElementById("review")
const cakeNavBar = document.getElementById("cake-list"); cakeNavBar.innerHTML = ""


////FUNCTIONS

function renderCake(cake){
    const cakeLine = document.createElement("li")
    cakeLine.innerHTML = cake.name
    cakeNavBar.appendChild(cakeLine)
    cakeLine.addEventListener("click", () => {
        displayCake(cake)
    })
}

function displayCake(cake){
    currentCake = cake
    cakeName.textContent = cake.name
    cakeImage.src = cake.image_url
    cakeDescription.textContent = cake.description
    descriptionTextAreaValue("")

    displayReview(cake.reviews)
}

function displayReview(reviews){
    reviewList.innerHTML = ""
    reviews.forEach(review => {
        const reviewElement = document.createElement("li")
        reviewElement.innerHTML = review
        reviewList.appendChild(reviewElement)

        reviewElement.addEventListener("click", (event) =>{ 
            deleteReview(event.target)
        })
    })
}

function deleteReview(review){
    reviewList.removeChild(review)
}

function descriptionTextAreaValue(description){
    descriptionTextArea.value = description
}

function patchCakeDescription(cake, newDescription){
    let data = {"description" : newDescription}
    patchRequest(cake,data)
        .then(res => res.json())
        .then(updatedCakeData => {
            displayCake(updatedCakeData)
        })
}

function patchCakeReviews(cake, newReview){
    let newReviewArray = cake.reviews
    newReviewArray.push(newReview)
    let data = {"reviews" : newReviewArray}
    patchRequest(cake,data)
        .then(res => res.json())
            .then(updatedCakeData => {
                displayReview(updatedCakeData.reviews)
            })
}

function patchRequest(cake,data){
    return fetch(`http://localhost:3000/cakes/${cake.id}`, { 
        "method" : "PATCH",
        "headers" : {"Content-Type" : "application/json"},
        "body" : JSON.stringify(data)
        })
}


////EVENT LISTENERS

descriptionTextArea.addEventListener("click", () => {
    descriptionTextAreaValue(currentCake.description)
})

descriptionForm.addEventListener("submit", (event) => {
    event.preventDefault()
    patchCakeDescription(currentCake, descriptionTextArea.value)
    descriptionForm.reset() 
})

reviewForm.addEventListener("submit", (event) => {
    event.preventDefault()
    patchCakeReviews(currentCake, reviewInput.value)
    displayReview(reviewInput.value)
    reviewInput.innerHTML = ""
    reviewForm.reset()
})


////INITIALIZING FETCH
fetch("http://localhost:3000/cakes")
.then(res => res.json())
.then(cakeData => {
    cakeData.forEach(cake => {
        renderCake(cake)
    }); 
    displayCake(cakeData[0])
})