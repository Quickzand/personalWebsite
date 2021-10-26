<?php
$msg = "Name: ".$_POST["name"]  . "\n" .  "Email: ".$_POST["email"] . "\n" . "Subject: " . $_POST["subject"] . "\n\n" . $_POST["content"];

// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg, 70);

// send email
mail("matthewsand22@gmail.com", "CONTACT PAGE MESSAGE - " . $_POST["subject"], $msg);

header("location: thankYou.html");
