<?php
	include 'functions.php';
	header("Content-Type: application/json");

	print_r(json_encode($api->get_state()));
?>
