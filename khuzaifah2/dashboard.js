document.addEventListener("DOMContentLoaded",()=>{



// =============================
// MOBILE SIDEBAR MENU
// =============================


const menuBtn =
document.querySelector(".menu-btn");


const sidebar =
document.querySelector(".sidebar");



menuBtn.addEventListener("click",()=>{


sidebar.classList.toggle("active");


});







// =============================
// LOAD STUDENT INFORMATION
// FROM REGISTER PAGE
// =============================



let student =
JSON.parse(
localStorage.getItem("student")
);



if(student){



let profileName =
document.querySelector(".profile h3");


let profileReg =
document.querySelector(".profile p");



profileName.innerHTML =
student.fullname;



profileReg.innerHTML =
student.registration;



}








// =============================
// GREETING BASED ON TIME
// =============================



let heading =
document.querySelector("header h1");



let hour =
new Date().getHours();



let greeting;



if(hour < 12){

greeting="Good Morning";

}

else if(hour < 18){

greeting="Good Afternoon";

}

else{

greeting="Good Evening";

}



if(student){


heading.innerHTML =
`${greeting}, ${student.fullname} 👋`;


}

else{


heading.innerHTML =
`${greeting}, Student 👋`;


}








// =============================
// SEARCH BOOKS
// =============================



const search =
document.querySelector(".search input");



const books =
document.querySelectorAll(".book-card");



search.addEventListener("keyup",()=>{


let value =
search.value.toLowerCase();



books.forEach(book=>{


let title =
book.querySelector("h3")
.textContent
.toLowerCase();



if(title.includes(value)){


book.style.display="block";


}

else{


book.style.display="none";


}



});



});









// =============================
// LOGOUT
// =============================



const logout =
document.querySelector(
'a[href="login.html"]'
);



logout.addEventListener("click",(e)=>{


let confirmLogout =
confirm(
"Are you sure you want to logout?"
);



if(!confirmLogout){


e.preventDefault();


}



});






});