// // Add group

// var SPU = "SampleSPU";
// var name = "SampleSHG";
// var area = "SampleArea";
// var depositoryBank = "SampleBank";
// var bankAccountType = "Savings";
// var bankAccountNum  = "SampleNum";
// var signatory_firstName = ["SampleFirstName"];
// var signatory_middleName = ["SampleMiddleName"];
// var signatory_lastName  = ["SampleLastName"];
// var other_firstName = ["SampleFirstName"];
// var other_middleName = ["SampleMiddleName"];
// var other_lastName = ["SampleLastName"];
// var other_contactNo = "SampleContactNumber";

// fetch('/newGroup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ SPU, name, area, depositoryBank, bankAccountType, bankAccountNum, 
//         signatory_firstName, signatory_middleName, signatory_lastName, 
//         other_firstName, other_middleName, other_lastName, other_contactNo }) // Send the name and location as JSON data
// })
// .then(response => {
//     if (response.ok) { // Check if the response status is in the 200 range
//         location.href = "/dashboard"; // Redirect to the dashboard on success
//     } else {
//         return response.json().then(data => {
//             // Handle errors here if needed
//             console.error('Error:', data.error);
//         });
//     }
// })
// .catch(error => {
//     console.error('Error:', error);
// });






// Add cluster

// const name = "sampleCluster1";
// const locations = "sampleCluster1";

// fetch('/newCluster', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ name, location:locations }) // Send the name and location as JSON data
// })
// .then(response => {
//     if (response.ok) { // Check if the response status is in the 200 range
//         location.href = "/dashboard"; // Redirect to the dashboard on success
//     } else {
//         return response.json().then(data => {
//             // Handle errors here if needed
//             console.error('Error:', data.error);
//         });
//     }
// })
// .catch(error => {
//     console.error('Error:', error);
// });


// Add Project

// const name = "sampleProject1";


// fetch('/newProject', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ name }) // Send the name and location as JSON data
// })
// .then(response => {
//     if (response.ok) { // Check if the response status is in the 200 range
//         location.href = "/dashboard"; // Redirect to the dashboard on success
//     } else {
//         return response.json().then(data => {
//             // Handle errors here if needed
//             console.error('Error:', data.error);
//         });
//     }
// })
// .catch(error => {
//     console.error('Error:', error);
// });


// fetch('/logout', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
// })
// .then(response => {
//     if (response.ok) {
//         location.href="/";
//     } else {
//         return response.json().then(data => {
//             // var errorDiv = document.getElementById("error");
//             // errorDiv.style.display="block";
//             // errorDiv.textContent=data.error;
//         });
//     }
// })
// .catch(error => {
//     console.error('Error:', error);
// });