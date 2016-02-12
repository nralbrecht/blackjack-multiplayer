<?php
	include 'functions.php';

	if ( !@empty($_GET['tokken']) ) {
		$api->disable_tokken($_GET['tokken']);
		http_response_code(200);
	} else {
		http_response_code(400);
	}
?>
