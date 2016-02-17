<?php
	include 'functions.php';

	if (!@empty($_GET['tokken'])) {
		$test = $api->finish_round($_GET['tokken']);
		http_response_code(200);
	} else {
		http_response_code(401);
	}
?>
