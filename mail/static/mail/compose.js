document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#compose-form");
    const banner = document.querySelector("#banner");
    form.addEventListener("submit", (event) => {
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
                    banner.innerHTML = `<div class="alert alert-warning" role="alert">
                                            ${result.error}
                                        </div>`;
                }
            });
    });
},
false
);