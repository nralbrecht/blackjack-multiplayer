<?php
	include 'functions.php';

	if (!@empty($_GET['username']) && !@empty($_GET['password'])) {
		if ($api->is_user_valid($_GET['username'], $_GET['password'])) {
			print($api->generate_tokken($_GET['username']));
			http_response_code(200);
		} else {
			http_response_code(400);
		}
	} else {
		http_response_code(400);
	}
?>