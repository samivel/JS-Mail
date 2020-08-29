document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // Send Email
  document.querySelector("#compose-form").addEventListener("submit", (event) => sendMail());
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#show-mail').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#show-mail').style.display = 'none';
  document.querySelector('#archive-button').style.display = 'none';
  document.querySelector('#unarchive-button').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch Emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    emails.forEach((email) => {
      const post = document.createElement('div');
      post.className = 'card m-3';
      if (email.read == false) {
        post.innerHTML = `<div class="card-body m3"><div style="font-weight: bold;">${email.sender}</div>  ${email.subject} <div style="float: right;">${email.timestamp}</div> </div>`
      } else {
        post.innerHTML = `<div class="card-body m3" style="background-color: #eee;"><div style="font-weight: bold;">${email.sender}</div>  ${email.subject} <div style="float: right;">${email.timestamp}</div> </div>`
      }
      post.addEventListener("click", () => {
        console.log(email.id);
        showMail(email.id, mailbox);
      })
      document.querySelector('#emails-view').append(post);
      

    });
  
})}


// This function will send the email
function sendMail() {

  const banner = document.querySelector("#banner");
  event.preventDefault();
  recipients = document.querySelector("#compose-recipients");
  subject = document.querySelector("#compose-subject");
  body = document.querySelector("#compose-body");
  
  fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
      recipients: recipients.value,
      subject: subject.value,
      body: body.value,
      }),
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      if (result.message === "Email sent successfully.") {
          load_mailbox("sent");
      } else {
          banner.innerHTML = `<div class="alert alert-warning" role="alert">${result.error}</div>`;
      }
  });

}

// This function will show the individual email 
function showMail(id, mailbox) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#show-mail').style.display = 'block';
  

  // Api call to render the email that was clicked on
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

    const mail = document.querySelector('#show-mail');
    mail.className = 'card';
    mail.innerHTML = `
      <div class="card-header">
          <div style="float: right;">${email.timestamp}</div>
          <div class="small">Subject:</div>
          <h4>${email.subject}</h4>
        
      </div>
      <div class="card-body">
        <div class="small">From: ${email.sender}</div>
        <div class="small">To: ${email.recipients}</div><br>
        <div class="p-10">${email.body}</div>
      </div>`;
    // With access to mailbox, Add a link to archive the mail
    reader3000(id)
    if (mailbox == "sent") return;
    if (email.archived == false){
      document.querySelector('#archive-button').style.display = 'block';
      document.querySelector('#archive-button').addEventListener('click', () => {
        archiverator3000(id, email.archived);

        load_mailbox('inbox');

    });
    } else {
      document.querySelector('#unarchive-button').style.display = 'block';
      document.querySelector('#unarchive-button').addEventListener('click', () => {
        archiverator3000(id, email.archived);
        load_mailbox('inbox');

      });
    }
  })
}
  // Api call to mark email as read if not already
function reader3000(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read : true
    })
  })
}

function archiverator3000(id, current) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: !current,
    }),
  });
}