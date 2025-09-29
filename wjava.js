document.addEventListener('DOMContentLoaded', function () 
{
    const calendarEl = document.getElementById('calendar');

    fetch("https://script.google.com/macros/s/AKfycbzx0cD5n0lIXCldGUbartlj4rzLut-006o76mYrg1fnR6gj559JMUtb5MIci2F67Qd0/exec") 
        .then(response => {
            console.log("Raw response:", response); 
            return response.json();
        })
        .then(events => {
            console.log("Fetched events:", events); 

            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                height: "auto",
                events: events.map(e => ({
                    title: e.Title,
                    start: e["Start Date"],
                    end: e["End Date"] ? new Date(new Date(e["End Date"]).setDate(new Date(e["End Date"]).getDate() + 1)) : null,
                    description: e.Description,
                    location: e.Location,
                    allDay: true
                })),
                eventTimeFormat: { 
                    hour: undefined,
                    minute: undefined,
                    meridiem: false
                },
                eventClick: function (info) {
                    info.jsEvent.preventDefault();

                    Swal.fire({
                        title: `Registration Form for ${info.event.title}`,
                        html: `
                            <form id="registrationForm">
                                <label><strong>Name:</strong></label><br>
                                <input type="text" id="name" class="swal2-input" required><br>

                                <label><strong>IC Number:</strong></label><br>
                                <input type="text" id="icNumber" class="swal2-input" required><br>

                                <label><strong>Email:</strong></label><br>
                                <input type="email" id="email" class="swal2-input" required><br>

                                <label><strong>Company:</strong></label><br>
                                <input type="text" id="company" class="swal2-input" required><br>

                                <label><strong>Department:</strong></label><br>
                                <input type="text" id="department" class="swal2-input"><br>

                                <label><strong>Staff Number:</strong></label><br>
                                <input type="text" id="staffNumber" class="swal2-input" required><br>

                            </form>
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Submit',
                        confirmButtonColor: '#285430',
                        preConfirm: () => 
                        {
                            return {
                                eventTitle: info.event.title,
                                eventDate: info.event.start.toDateString(),
                                name: document.getElementById('name').value,
                                icNumber: document.getElementById('icNumber').value,
                                email: document.getElementById('email').value,
                                company: document.getElementById('company').value,
                                department: document.getElementById('department').value,
                                staffNumber: document.getElementById('staffNumber').value
                            }
                        }
                    }).then((result) => 
                      {
                        if (result.isConfirmed)
                            {
                            fetch("https://script.google.com/macros/s/AKfycbxpcckTiXA_DeqyI-VzETyRYo-U6dnP6eVEmZI4wvm7Clv45MZQyhoclULFdonwD7ZM/exec", {
                                method: "POST",
                                mode: "no-cors", 
                                body: JSON.stringify(result.value)
                            })
                            .then(response => {
                                console.log("Registration request sent. Response (Opaque in 'no-cors'):", response);
                                Swal.fire(
                                    'Registered!',
                                    'Your registration has been submitted.',
                                    'success'
                                );
                            })
                            .catch(error => {
                                console.error("Error submitting registration:", error);
                                Swal.fire(
                                    'Error!',
                                    'A network error occurred during submission. Check the console for details.',
                                    'error'
                                );
                            });
                        }
                    });
                }
            });

            calendar.render();
        })
        .catch(error => {
            console.error("Error fetching events:", error); 
        });
});