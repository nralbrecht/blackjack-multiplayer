<?php
	class DatabaseWrapper
	{
		private $link;

		public function __construct($db_name)
		{
			$this->$link = @mysqli_connect(
				"localhost"
				, "root"
				, "dbnils"
				, $db_name
				, 3307
			) or throw new Exception("could not connect to database '".$db_name."'", 503);

			$this->link->set_charset("utf8");
		}

		public function query($sql)
		{
			if (!@is_string($query) || empty($query))
				throw new Exception("the sql statement is malformed: '".$query."'", 400);

			$result = $this->link->query($query);

			if ( is_bool($result) ) {
				return $result;
			}
			return $this->get_rows($result);
		}

		private function getRows($result) {
			while ($row = $result->fetch_array(MYSQL_ASSOC)) {
					$rows[] = $row;
			}
			return (empty($rows)) ? array() : $rows;
		}
	}

	$db_blackjack = new DatabaseWrapper("blackjack_multiplayer");

	validate_user($username, $password) {
		$hash = $db_blackjack->query("SELECT password FROM user WHERE username = '$password'");

		if (condition) {
			# code...
		}
		return crypt($password, $hash) == $hash;
	}

	// validate_user(username, password)
	// - user_tokken
	// -? unkown user
	// -? session_timed_out




?>