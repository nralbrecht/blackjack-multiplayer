<?php
	include 'functions.php';

	if (!@empty($_GET['tokken']) && !@empty($_GET['bet'])) {
		$res = $api->join_tokken($_GET['tokken'], $_GET['bet']);

		if ($res == "BET_INVALID") {
			http_response_code(406);
		} elseif ($res == "CREATED") {
			http_response_code(201);
		} elseif ($res == "EXISTS") {
			http_response_code(200);
		} else {
			http_response_code(500);
		}
	} else {
		http_response_code(400);
	}
?>
