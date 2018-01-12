<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $fname = strip_tags(trim($_POST["fname"]));
				$fname = str_replace(array("\r","\n"),array(" "," "),$fname);
        $lname = strip_tags(trim($_POST["lname"]));
        $lname = str_replace(array("\r","\n"),array(" "," "),$lname);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $number = trim($_POST["phone"]);
        $message = trim($_POST["message"]);
        $name = "$fname $lname";

        //Check that data was sent to the mailer.
        // if ( empty($fname) OR empty($number) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        //     // Set a 400 (bad request) response code and exit.
        //     http_response_code(401);
        //     echo "Oops! There was a problem with your submission. Please complete the form and try again.";
        //     echo $fname.' '.$lname.' '.$email.' '.$message;
        //     exit;
        // }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "ayushyamitabh@gmail.com";

        // Set the email subject.
        $subject = "New contact submission from $name";

        // Build the email content.
        $email_content = "Name: $name \n Email: $email \n Number: $number \n Message:---\n $message";


        // Build the email headers.
        $email_headers = "From: $name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
