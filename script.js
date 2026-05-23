const form = document.querySelector("#enquiryForm");
const formNote = document.querySelector("#formNote");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = encodeURIComponent(`Website enquiry - ${service}`);
  const body = encodeURIComponent(
    `Name: ${name}\nContact: ${contact}\nService: ${service}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:hozefa@cahzgassociates.co.in?subject=${subject}&body=${body}`;
  formNote.textContent = "Opening your email app with the enquiry details.";
});
