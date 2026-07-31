document.addEventListener("DOMContentLoaded", function(){


const loginForm = document.getElementById("loginForm");

const regno = document.getElementById("regno");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const regError = document.getElementById("regError");

const passError = document.getElementById("passError");

const toast = document.getElementById("toast");




// ===============================
// SHOW / HIDE PASSWORD
// ===============================


togglePassword.addEventListener("click",()=>{


    if(password.type === "password"){

        password.type="text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    }

    else{

        password.type="password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }


});





// ===============================
// TOAST MESSAGE FUNCTION
// ===============================


function showToast(message,color="#0066ff"){


    toast.innerHTML = message;

    toast.style.background=color;

    toast.style.display="block";


    setTimeout(()=>{

        toast.style.display="none";

    },3000);


}





// ===============================
// REGISTRATION NUMBER VALIDATION
// Example:
// UICT/2026/001
// ===============================


function validateRegNo(){


let pattern = /^UICT\/[0-9]{4}\/[0-9]{4}$/;


if(!pattern.test(regno.value)){


    regError.innerHTML=
    "Format should be UICT/2026/0001";


    regError.style.color="red";


    return false;


}


regError.innerHTML="";


return true;


}





// ===============================
// PASSWORD VALIDATION
// ===============================


function validatePassword(){


if(password.value.length < 6){


    passError.innerHTML=
    "Password must contain at least 6 characters";


    passError.style.color="red";


    return false;

}


passError.innerHTML="";


return true;


}





// ===============================
// LOGIN PROCESS
// ===============================


loginForm.addEventListener("submit",function(e){


e.preventDefault();



let validReg = validateRegNo();

let validPass = validatePassword();



if(!validReg || !validPass){

    showToast(
    "Please correct the errors",
    "red"
    );

    return;

}





// Remember Me

let remember =
document.querySelector(
'input[type="checkbox"]'
);



if(remember.checked){


localStorage.setItem(
"userRegNo",
regno.value
);


}





// Temporary login simulation

showToast(
"Logging in...",
"#0066ff"
);



setTimeout(()=>{


// Later replaced with Django API

if(
regno.value==="UICT/2026/0001"
&&
password.value==="123456"
){


showToast(
"Login Successful",
"green"
);



setTimeout(()=>{

window.location.href="dashboard.html";


},1500);



}

else{


showToast(
"Invalid registration number or password",
"red"
);


}


},1000);



});

function submit(){
    window.location.href="dashboard.html";
}





// ===============================
// LOAD SAVED USER
// ===============================


let savedUser =
localStorage.getItem("userRegNo");


if(savedUser){

    regno.value=savedUser;

}



});