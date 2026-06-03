const API = "https://movx.onrender.com/api";

// ===== SIGNUP =====
async function signupUser(){
    try{
        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${API}/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });

        const result = await res.json();
        console.log(result);
        alert(result.message);
        window.location.href = "login.html";
    }
    catch(err){
        console.log(err);
        alert("Signup Error");
    }
}

// ===== LOGIN =====
async function loginUser(){
    try{
        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${API}/login`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });

        const result = await res.json();
        console.log(result);

        if(result.token){
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            alert("✅ Login Successful");
            window.location.href = "index.html";
        }
        else{
            alert(result.message);
        }
    }
    catch(err){
        console.log(err);
        alert("Login Error");
    }
}