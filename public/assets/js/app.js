var scrapeArticles = function () {

    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $(".panel-body").append("<div class='col s12 m7'><div class='card horizontal'><div class='card-stacked'><div class='card-content'><p data-id='"
                + data[i]._id
                + "'>"
                + data[i].title
                + "<br />"
                + data[i].link
                + "</p></div><div class='card-action'><a id='addNote' class='waves-effect waves-light btn-small red darken-4' data-id='"
                + data[i]._id
                + "'>Add Notes</a></div></div></div></div>");
        }
    });
}

$("#scrapeBtn").on("click", function () {
    scrapeArticles();
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the comment from the note section
    $("#comment").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .done(function (data) {
            console.log(data);
            // The title of the article
            $("#comment").append("<p>" + data.title + "</p>");
            // An input to enter a new title
            $("#comment").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comment").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// Whenever someone clicks an add note button
$(document).on("click", "#addNote", function () {
    // Empty the comment from the note section
    $("#comment").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .done(function (data) {
            console.log(data);
            // The title of the article
            $("#comment").append("<h5>" + data.title + "</h5>");
            // An input to enter a new title
            $("#comment").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comment").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .done(function (data) {
            // Log the response
            console.log(data);
            // Empty the comment section
            $("#comment").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});





































// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $(".panel-title").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
// });


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function () {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//     })
//         // With that done, add the note information to the page
//         .then(function (data) {
//             console.log(data);
//             // The title of the article
//             $("#comment").append("<h2>" + data.title + "</h2>");
//             // An input to enter a new title
//             $("#comment").append("<input id='titleinput' name='title' >");
//             // A textarea to add a new note body
//             $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
//             // A button to submit a new note, with the id of the article saved to it
//             $("#comment").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a note in the article
//             if (data.comment) {
//                 // Place the title of the comment in the title input
//                 $("#titleinput").val(data.comment.title);
//                 // Place the body of the comment in the body textarea
//                 $("#bodyinput").val(data.comment.body);
//             }
//         });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function () {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             // Value taken from title input
//             title: $("#titleinput").val(),
//             // Value taken from note textarea
//             body: $("#bodyinput").val()
//         }
//     })
//         // With that done
//         .then(function (data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });