
const API = "https://movx.onrender.com/api";

async function signupUser(){
    try{
        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${API}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log("Server Response:", result);

        if(result.message === "Signup Successful"){
            alert("✅ Signup Successful!");
            window.location.href = "login.html";
        } else if(result.message === "User Already Exists"){
            alert("❌ User Already Exists!");
        } else if(result.error){
            alert("❌ Error: " + result.error);
        } else {
            alert("Something went wrong: " + JSON.stringify(result));
        }
    }
    catch(err){
        console.log(err);
        alert("❌ Server Error - 30 sec baad try karo!");
    }
}

// ===== LOGIN =====
async function loginUser(){
    try{
        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log("Server Response:", result);

        if(result.token){
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            alert("✅ Login Successful!");
            window.location.href = "index.html";
        } else {
            alert("❌ " + result.message);
        }
    }
    catch(err){
        console.log(err);
        alert("❌ Server Error - 30 sec baad try karo!");
    }
}