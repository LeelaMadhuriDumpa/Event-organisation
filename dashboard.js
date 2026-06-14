const user = JSON.parse(localStorage.getItem("user"));
if(!user){
   window.location.href="login.html";
}

document.getElementById("name").textContent = user.name || "";
document.getElementById("email").textContent = user.email || "";
document.getElementById("phone").textContent = user.phone || "";
document.getElementById("gender").textContent = user.gender || "";
document.getElementById("address").textContent = user.address || "";
 document.getElementById("eventType").textContent =
        user.eventType || "";
 document.getElementById("eventDate").textContent =
        user.eventDate || "";

    document.getElementById("eventTime").textContent =
        user.eventTime || "";

document.getElementById("userInfo").textContent = `Hello ${user.name}! 🎉`;

document.getElementById("logoutBtn").addEventListener("click",()=>{
 localStorage.clear();
 window.location.href="login.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
});
