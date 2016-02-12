<?php
	include 'functions.php';

	if (!@empty($_GET['tokken']) && !@empty($_GET['bet'])) {
		$api->join_tokken($_GET['tokken'], $_GET['bet']);
		http_response_code(200);
	} else {
		http_response_code(400);
	}
?>
