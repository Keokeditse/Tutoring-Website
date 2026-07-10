  const EMAILJS_CONFIG = {
    publicKey:  "7rIOs5RtFsRUfMHIZ",    // e.g. "abc123def456"
    serviceID:  "service_0kquz8f",    // e.g. "abc123def456"
    templateID: "template_m4n8ex9"    // e.g. "template_xyz789"
  };


  // Initialize EmailJS
  emailjs.init(EMAILJS_CONFIG.publicKey);

  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Disable button and show sending state
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Sending...';
    status.textContent = '';
    status.className = 'form-status';

    // Collect form data
    const course   = document.getElementById('course').value;
    const fromEmail = document.getElementById('email').value;
    const details  = document.getElementById('details').value;
    const currentTime = document.getElementById('time').value;
    const name = document.getElementById('name').value;

    // Template parameters — must match your EmailJS template variables
    const templateParams = {
      subject:    "Tutorial Booking Enquiry",
      name:       name,
      course:     course,
      from_email: fromEmail,
      message:    details,
      time:       currentTime
      // The tutor's email (where the email gets sent to)
    };

    // Send via EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
      .then(function(response) {
        status.textContent = '✅ Enquiry sent successfully! I\'ll respond within 24 hours.';
        status.className = 'form-status success';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = '✉️ Send Booking Enquiry';
      })
      .catch(function(error) {
        console.error('EmailJS error:', error);
        status.textContent = '❌ Failed to send. Please email me directly at g23n3545@campus.ru.ac.za';
        status.className = 'form-status error';
        submitBtn.disabled = false;
        submitBtn.textContent = '✉️ Send Booking Enquiry';
      });
  });