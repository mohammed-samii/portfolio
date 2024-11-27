document.addEventListener('DOMContentLoaded', (event) => {

  // FIREBASE
    const database = firebase.database();
    // Initialize poll counts in Firebase
    function initializePollCounts() {
        const pollRef = database.ref('poll');
        pollRef.once('value', (snapshot) => {
          if (!snapshot.exists()) {
            pollRef.set({ yes: 0, no: 0 });
          }
        });
      }
    // UPDATE POLL COUNTS
      function updatePollCounts() {
        const pollRef = database.ref('poll');
        pollRef.once('value', (snapshot) => {
          const pollData = snapshot.val();
          const totalVotes = (pollData.yes || 0) + (pollData.no || 0);
          const yesPercent = totalVotes ? (pollData.yes / totalVotes) * 100 : 0;
          const noPercent = totalVotes ? (pollData.no / totalVotes) * 100 : 0;
    
          const yesBar = document.getElementById('yesBar');
          const noBar = document.getElementById('noBar');
    
          yesBar.style.width = `${yesPercent}%`;
          yesBar.textContent = `${Math.round(yesPercent)}%`;
    
          noBar.style.width = `${noPercent}%`;
          noBar.textContent = `${Math.round(noPercent)}%`;
        });
      }
    
      // Event listeners for buttons
      document.getElementById('yesButton').addEventListener('click', function() {
        const pollRef = database.ref('poll');
        pollRef.transaction((pollData) => {
          if (pollData) {
            pollData.yes = (pollData.yes || 0) + 1;
          }
          return pollData;
        }, (error, committed, snapshot) => {
          if (committed) {
            updatePollCounts();
            new bootstrap.Modal(document.getElementById('pollModal')).show();
          }
        });
      });
    
      document.getElementById('noButton').addEventListener('click', function() {
        const pollRef = database.ref('poll');
        pollRef.transaction((pollData) => {
          if (pollData) {
            pollData.no = (pollData.no || 0) + 1;
          }
          return pollData;
        }, (error, committed, snapshot) => {
          if (committed) {
            updatePollCounts();
            new bootstrap.Modal(document.getElementById('pollModal')).show();
          }
        });
      });
    
      // Initialize and display poll counts on page load
      initializePollCounts();
      updatePollCounts();
    });

    document.addEventListener('DOMContentLoaded', function() {
      const texts = ["Software Engineer", "Developer", "Tech Enthusiast"];
      let currentIndex = 0;
      const typingText = document.getElementById('typing');
    
      function typeText() {
        typingText.textContent = texts[currentIndex];
        typingText.classList.add('typing');
    
        setTimeout(function() {
          typingText.classList.remove('typing');
          currentIndex = (currentIndex + 1) % texts.length;
          setTimeout(typeText, 2000);
        }, 3000);
      }
    
      function startTypingAnimation() {
        if (window.matchMedia("(min-width: 768px)").matches) {
          typingText.classList.add('typing');
          typeText();
        } else {
          // Directly set the text for mobile screens
          typingText.textContent = "Software Engineer";
          typingText.classList.remove('typing'); // Ensure animation is off
        }
      }
    
      startTypingAnimation();
    
      // Optional: Add event listener for window resize if you want dynamic updates
      window.addEventListener('resize', startTypingAnimation);
    });
    

    function getColor(value) {
      const red = Math.max(255 - (value * 255 / 100), 0);
      const green = Math.max((value * 255 / 100), 0);
      return `rgb(${red}, ${green}, 0)`;
  }
  // SKILL BAR
  document.querySelectorAll('.skill-progress-bar').forEach(bar => {
      const value = bar.getAttribute('data-value');
      bar.style.width = `${value}%`;
      bar.style.backgroundColor = getColor(value);
  });
  
  document.querySelectorAll('.skill-progress-percentage').forEach(span => {
      const value = span.getAttribute('data-value');
      span.textContent = `${value}%`;
  });
  
  
  let currentDateTime = new Date().toLocaleString(); // Get the current date and time

  function sendMail() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    if (!validateName(name)) {
      alert("Please enter a valid full name (two words, no numbers).");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    let params = {
      name: name,
      email: email,
      message: message,
      dateTime: currentDateTime
    };

    console.log("Sending email with params:", params); // Debugging line

    emailjs.send("service_1pu7wiv", "template_x0unh8g", params)
      .then(function(response) {
        console.log("Email sent successfully:", response); // Debugging line
        alert("Thank you for your message, I will respond as soon as I can.");
      }, function(error) {
        console.error("Failed to send email:", error); // Debugging line
        alert("There was an error sending your message. Please try again later.");
      });
  }

  // Validate full name (two words, no numbers)
  function validateName(name) {
    const nameRegex = /^[a-zA-Z]$/; // Two words, alphabetic only
    return nameRegex.test(name);
  }

  // Validate email address
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
