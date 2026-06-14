const form = document.getElementById("forgotPasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email =
    document.getElementById("email").value;

  const phone =
    document.getElementById("phone").value;

  const newPassword =
    document.getElementById("newPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const message =
    document.getElementById("forgotMessage");

  if (newPassword !== confirmPassword) {
    message.textContent =
      "Passwords do not match!";
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          phone,
          newPassword
        })
      }
    );

    const result =
      await response.json();

    message.textContent =
      result.message;

    if (response.ok) {

      setTimeout(() => {
        window.location.href =
          "login.html";
      }, 2000);
    }

  } catch (error) {

    message.textContent =
      "Server Error";
  }
});
