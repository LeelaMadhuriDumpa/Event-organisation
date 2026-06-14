// ============================
// Registration Form
// ============================

const form = document.getElementById("registerForm");
const formSteps = document.querySelectorAll(".form-step");
const progress = document.getElementById("progress");
const progressSteps = document.querySelectorAll(".progress-step");

let currentStep = 0;

// Update Progress Bar
function updateProgressBar() {
  if (progress && formSteps.length > 0) {
    progress.style.width =
      (currentStep / (formSteps.length - 1)) * 100 + "%";

    progressSteps.forEach((step, index) => {
      step.classList.toggle("active", index <= currentStep);
    });
  }
}

// Next Buttons
if (formSteps.length > 0) {
  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      formSteps[currentStep].classList.remove("active");
      currentStep++;
      formSteps[currentStep].classList.add("active");
      updateProgressBar();
    });
  });

  // Previous Buttons
  document.querySelectorAll(".prev-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      formSteps[currentStep].classList.remove("active");
      currentStep--;
      formSteps[currentStep].classList.add("active");
      updateProgressBar();
    });
  });
}


// ============================
// Password Strength
// ============================

const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const strengthText = document.getElementById("passwordStrength");
const confirmMessage = document.getElementById("confirmMessage");

// Password Strength
if (passwordInput && strengthText) {
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    const strongRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const mediumRegex =
      /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password)) {
      strengthText.textContent = "Strong Password";
      strengthText.className = "strong";

    } else if (mediumRegex.test(password)) {
      strengthText.textContent = "Medium Password";
      strengthText.className = "medium";

    } else {
      strengthText.textContent = "Weak Password";
      strengthText.className = "weak";
    }
  });
}

// Confirm Password
if (confirmInput && confirmMessage && passwordInput) {
  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmMessage.textContent =
        "Passwords do not match!";
    } else {
      confirmMessage.textContent = "";
    }
  });
}


// ============================
// Registration Submit
// ============================

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Password Strength Check
    if (
      strengthText &&
      strengthText.className !== "strong"
    ) {
      alert(
        "Please choose a strong password.\nExample: Tech@1234"
      );
      return;
    }

    // Confirm Password Check
    if (
      confirmInput &&
      confirmInput.value !== passwordInput.value
    ) {
      alert("Passwords do not match!");
      return;
    }

    const formData = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value,
      gender: form.gender.value,
      address: form.address.value,
      state: form.state.value,
      pincode: form.pincode.value,
      eventType: form.eventType.value,
      eventDate: form.eventDate.value,
      eventTime: form.eventTime.value,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      const successBox =
        document.getElementById(
          "successMessage"
        );

      successBox.textContent =
        result.message;

      successBox.className =
        response.ok ? "success" : "error";

      // Redirect to Login after success
      if (response.ok) {
        setTimeout(() => {
          window.location.href =
            "login.html";
        }, 1500);
      }

    } catch (error) {
      console.error(error);

      document.getElementById(
        "successMessage"
      ).textContent =
        "Error submitting form.";

      document.getElementById(
        "successMessage"
      ).className = "error";
    }
  });
}


// ============================
// Login Submit
// ============================

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();

      const email =
        loginForm.elements["email"].value;

      const password =
        loginForm.elements["password"].value;

      try {
        const response = await fetch(
          "http://localhost:5000/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const result =
          await response.json();

        const messageBox =
          document.getElementById(
            "loginMessage"
          );

        if (response.ok) {

          localStorage.setItem(
            "user",
            JSON.stringify(result.user)
          );

          localStorage.setItem(
            "token",
            result.token
          );

          messageBox.textContent =
            "Login Successful";

          messageBox.className =
            "success";

          setTimeout(() => {
            window.location.href =
              "dashboard.html";
          }, 1000);

        } else {
          messageBox.textContent =
            result.message ||
            "Invalid Credentials";

          messageBox.className =
            "error";
        }

      } catch (error) {
        console.error(error);

        document.getElementById(
          "loginMessage"
        ).textContent =
          "Server Error";

        document.getElementById(
          "loginMessage"
        ).className = "error";
      }
    }
  );
}
