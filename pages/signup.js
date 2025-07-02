        window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        setupEnterKey(); // activate Enter key bindings after load
      }, 1000);
    });

// Pop- Up Box
    function showPopup(message) {
      document.getElementById('popupMessage').textContent = message;
      document.getElementById('popupBox').classList.remove('hidden');
    }

    function closePopup() {
      document.getElementById('popupBox').classList.add('hidden');
    }


        function nextStep(nextId) {
      const visibleStep = document.querySelector('form > div:not(.hidden)');
      const input = visibleStep.querySelector('input');
      if (!input.value) {
        input.reportValidity();
        return;
      }
      const steps = ['step-name', 'step-email', 'step-verification', 'step-platform', 'step-password'];
      steps.forEach(step => document.getElementById(step).classList.add('hidden'));
      document.getElementById('step-' + nextId).classList.remove('hidden');
      focusFirstInput(); // move focus to next input
    }

// Validate the name

function validateName() {
  const nameInput = document.getElementById('name');
  const nameValue = nameInput.value.trim();

  if (nameValue === "") {
    showPopup("Please enter your name.");
    nameInput.focus();
    return false;
  }

  // ✅ The missing regex definition
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameValue)) {
    showPopup("❌ Name cannot contain numbers or special characters.");
    nameInput.focus();
    return false;
  }

  return true;
}




      function sendVerification() {
        const emailInput = document.getElementById('email');
        const emailValue = emailInput.value.trim();

        if (!emailValue) {
          emailInput.reportValidity();
          return;
        }

        // ✅ Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          showPopup("Please enter a valid email address.");
          emailInput.focus();
          return;
        }

        // 🔍 Check if email already exists in JSONBin
                fetch(JSONBIN_URL + '/latest', {
          method: 'GET',
          headers: {
            'X-Master-Key': JSONBIN_API_KEY
          }
        })
        .then(response => response.json())
        .then(data => {
          let existingUsers = data.record;

          if (!Array.isArray(existingUsers)) {
            existingUsers = [];  // if not an array, treat as empty
          }

          const emailExists = existingUsers.some(user => user.email === emailValue);

          if (emailExists) {
            showPopup("🚫 This email is already registered. Please login instead.");
            return;
          }

          showPopup("Verification code sent to " + emailValue);
          nextStep('verification');
        })
        .catch(error => {
          console.error('Error checking email:', error);
          showPopup("Something went wrong while verifying email.");
        });
      }



    function verifyCode() {
      const code = document.getElementById('verificationCode').value;
      if (code === "") {
        showPopup("Please enter the verification code.");
        return;
      }
      if (code !== "1234") {
        showPopup("Incorrect code. Try '1234' to proceed for demo.");
        return;
      }
      nextStep('platform');
    }


let isPlatformValid = false;

function validatePlatformId() {
  const platformInput = document.getElementById('platformId');
  const platformValue = platformInput.value.trim();
  const statusIcon = document.getElementById('platformStatus');



  // Check uniqueness from JSONBin
  fetch(JSONBIN_URL + '/latest', {
    method: 'GET',
    headers: {
      'X-Master-Key': JSONBIN_API_KEY
    }
  })
  .then(response => response.json())
 .then(data => {
  let existingUsers = data.record;

  if (!Array.isArray(existingUsers)) {
    existingUsers = [];
  }

  const idExists = existingUsers.some(user => user.platform === platformValue);

  if (idExists) {
    statusIcon.textContent = "❌";
    statusIcon.classList.remove('text-green-600');
    statusIcon.classList.add('text-red-600');
    isPlatformValid = false;
  } else {
    statusIcon.textContent = "✅";
    statusIcon.classList.remove('text-red-600');
    statusIcon.classList.add('text-green-600');
    isPlatformValid = true;
  }
})

  .catch(error => {
    console.error('Error checking Platform ID:', error);
    statusIcon.textContent = "⚠️";
    statusIcon.classList.remove('text-green-600', 'text-red-600');
    statusIcon.classList.add('text-yellow-500');
    isPlatformValid = false;
  });
}


        function focusFirstInput() {
      const visibleStep = document.querySelector('form > div:not(.hidden)');
      const input = visibleStep.querySelector('input');
      if (input) {
        input.focus();
      }
    }

    // Attach Enter key behavior dynamically
    function setupEnterKey() {
      const inputs = document.querySelectorAll('#signupForm input');
      inputs.forEach(input => {
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            const stepId = this.closest('div').id;
            if (stepId === 'step-name') {
              if (validateName()) nextStep('email');
            }
            else if (stepId === 'step-email') sendVerification();
            else if (stepId === 'step-verification') verifyCode();
            else if (stepId === 'step-platform') {
              const platformInput = document.getElementById('platformId');
              const platformValue = platformInput.value.trim();

              // If not valid (from live check)
              if (!isPlatformValid) {
                showPopup("🚫 This Platform ID is already taken. Choose another.");
                return;
              }

              nextStep('password');
            }
            else if (stepId === 'step-password') {
              document.getElementById('signupForm').requestSubmit();
            }
          }
        });
      });
    }


        function handlePlatformNext() {
      const platformInput = document.getElementById('platformId');
      const platformValue = platformInput.value.trim();


      if (!isPlatformValid) {
        showPopup("🚫 This Platform ID is already taken. Choose another.");
        return;
      }

      nextStep('password');
    }



    function togglePassword() {
      const passwordInput = document.getElementById("password");
      const toggleBtn = passwordInput.nextElementSibling;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "Show";
      }
    }

    // Form Submit Handling 

        // 🔐 JSONBin Configuration
        const JSONBIN_API_KEY = '$2a$10$zfkeuMdpszTDDjZmrJa8S.Lp2Zm./Ck6QPgUnWJ5BwTNI4srWthjG';
        const JSONBIN_BIN_ID = '686505fa8561e97a50302a7a';
        const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

        // ⚡ Submit Handler
        document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const platform = document.getElementById('platformId').value;
  const password = document.getElementById('password').value;

  if (!name || !email || !platform || !password) {
    showPopup("Please fill all fields.");
    return;
  }

  if (!isPlatformValid) {
    showPopup("🚫 This Platform ID is already taken. Choose another.");
    return;
  }

  const userData = {
    name: name,
    email: email,
    platform: platform,
    password: password
  };

  // Step 1: Get existing users
  fetch(JSONBIN_URL + '/latest', {
    method: 'GET',
    headers: {
      'X-Master-Key': JSONBIN_API_KEY
    }
  })
  .then(response => response.json())
  .then(data => {
    let users = data.record;

    if (!Array.isArray(users)) {
      users = []; // Initialize as array if empty or not yet an array
    }

    users.push(userData); // Add new user

    // Step 2: PUT updated array back
    return fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(users)
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    showPopup("✅ Account created successfully! Redirecting to your inbox...");
    setTimeout(() => {
      window.location.href = 'app.html';
    }, 800);
  })
  .catch(error => {
    console.error('Error:', error);
    showPopup("Something went wrong while creating your account.");
  });
});
