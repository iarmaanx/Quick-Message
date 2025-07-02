      // Send message
        function sendMessage() {
      const messageInput = document.getElementById("messageInput");
      const message = messageInput.value.trim();
      if (!message) return;

      const chatWindow = document.getElementById("chatWindow");

      const messageWrapper = document.createElement("div");
      messageWrapper.className = "flex justify-end";  // aligns to right

      const messageDiv = document.createElement("div");
      messageDiv.className =
        "p-3 bg-white/60 backdrop-blur-sm rounded-xl max-w-xs text-left text-blue-800 shadow";
      messageDiv.textContent = message;

      messageWrapper.appendChild(messageDiv);
      chatWindow.appendChild(messageWrapper);

      chatWindow.scrollTop = chatWindow.scrollHeight;
      messageInput.value = "";
    }


    // Enter key to send
    document.getElementById("messageInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

    // Mobile sidebar toggle
    document.getElementById("toggleSidebar").addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("-translate-x-full");
    });

    // Desktop sidebar toggle
    document.getElementById("desktopToggleSidebar").addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      const chatSection = document.getElementById("chatSection");
      sidebar.classList.toggle("hidden");

      if (sidebar.classList.contains("hidden")) {
        chatSection.classList.remove("md:w-[70%]");
        chatSection.classList.add("md:w-full");
      } else {
        chatSection.classList.remove("md:w-full");
        chatSection.classList.add("md:w-[70%]");
      }
    });

    // Close sidebar (for mobile)
    function closeSidebar() {
      document.getElementById("sidebar").classList.add("-translate-x-full");
    }

    // Logout
    function logout() {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "../index.html";
      }
    }
