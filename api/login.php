<?php
	include 'functions.php';

	if (!@empty($_GET['username']) && !@empty($_GET['password'])) {
		if ($api->is_user_valid($_GET['username'], $_GET['password'])) {
			print(json_encode([
				username => $_GET['username'],
				balance => $api->get_user_balance($_GET['username']),
				tokken => $api->get_tokken($_GET['username'])
			]));
			http_response_code(202);
		} else {
			http_response_code(401);
		}
	} else {
		http_response_code(400);
	}
?>
