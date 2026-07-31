document.addEventListener("DOMContentLoaded",()=>{


const form =
document.getElementById("registerForm");



// Get all inputs

const inputs =
form.querySelectorAll("input");


const name =
inputs[0];

const regno =
inputs[1];

const email =
inputs[2];

const phone =
inputs[3];

const password =
inputs[4];

const confirmPassword =
inputs[5];




// Create Toast

let toast =
document.createElement("div");

toast.id="toast";

document.body.appendChild(toast);



function showToast(message,color){


toast.innerHTML=message;

toast.style.background=color;

toast.style.display="block";


setTimeout(()=>{

toast.style.display="none";

},3000);


}





// Registration number validation

function checkRegNo(){


let pattern =
/^UICT\/[0-9]{4}\/[0-9]{3}$/;



if(!pattern.test(regno.value)){


showToast(
"Registration must be UICT/2026/001",
"red"
);


return false;


}


return true;


}





// Email validation

function checkEmail(){


let pattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(!pattern.test(email.value)){


showToast(
"Enter a valid email address",
"red"
);


return false;

}


return true;


}





// Password validation


function checkPassword(){


if(password.value.length < 6){


showToast(
"Password must be at least 6 characters",
"red"
);


return false;


}



if(password.value !== confirmPassword.value){


showToast(
"Passwords do not match",
"red"
);


return false;


}


return true;


}





// Submit Registration


form.addEventListener(
"submit",
(e)=>{


e.preventDefault();



if(!checkRegNo()) return;


if(!checkEmail()) return;


if(!checkPassword()) return;





// Temporary storage

let student = {


fullname:name.value,

registration:regno.value,

email:email.value,

phone:phone.value,

course:
form.querySelector("select").value


};




localStorage.setItem(
"student",
JSON.stringify(student)
);





showToast(
"Registration Successful",
"green"
);





setTimeout(()=>{


window.location.href="login.html";


},2000);



});



});