<?php
	include 'functions.php';

	if (!@empty($_GET['username']) && !@empty($_GET['password']) && !@empty($_GET['password2'])) {
		if ($_GET['password'] == $_GET['password2']) {
			$status = $api->register_user($_GET['username'], crypt($_GET['password']));

			if ($status == "CREATED") {
				http_response_code(201);
			} elseif ($status == "EXISTS") {
				http_response_code(200);
			} elseif ($status == "DUPLICATED_USERNAME") {
				http_response_code(409);
			} else {
				http_response_code(500);
			}
		} else {
			http_response_code(401);
		}
	} else {
		http_response_code(400);
	}
?>
