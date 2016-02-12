<?php

	class DatabaseWrapper
	{
		private $link;

		public function __construct($db_name) {
			$this->link = @mysqli_connect(
				"localhost"
				, "root"
				, "dbnils"
				, $db_name
				, 3307
			);
		}

		public function query($sql) {
			try {
				if (!@is_string($sql) || empty($sql))
					throw new Exception("the sql statement is malformed: $sql", 400);

				$result = $this->link->query($sql);

				if ( is_bool($result) ) {
					return $result;
				}
				return $this->get_rows($result);
			} catch (Exception $e) {
				throw $e;
			}
		}

		private function get_rows($result) {
			while ($row = $result->fetch_array(MYSQL_ASSOC)) {
					$rows[] = $row;
			}
			return (empty($rows)) ? array() : $rows;
		}
	};

	class api
	{
		private $database;

		public function __construct($dbname) {
			$this->database = new DatabaseWrapper($dbname);
		}

		public function generate_tokken($username) {
			$res = $this->database->query("SELECT `id` FROM `user` WHERE `enabled` = 1 AND `username` = '".$username."' LIMIT 1;");
			if (empty($res)) { return false; }
			$id = $res[0]['id'];

			$res_old = $this->database->query("SELECT `tokken` FROM `tokkens` WHERE `user_id` = '".$id."' AND `valid_until` > CURRENT_TIMESTAMP() AND `enabled` = 1 ORDER BY(`valid_until`) DESC LIMIT 1;");

			if (count($res_old) > 0) {
				$this->database->query("UPDATE `tokkens` SET `valid_until` = DATE_ADD(CURRENT_TIMESTAMP(),INTERVAL 10 MINUTE) WHERE `user_id` = '".$id."' AND `valid_until` > CURRENT_TIMESTAMP() AND `enabled` = 1 ORDER BY(`valid_until`) DESC LIMIT 1;");
				return $res_old[0]['tokken'];
			}

			$this->database->query('INSERT INTO `tokkens`(`user_id`, `tokken`, `valid_until`) VALUES ('.$id.', SHA1(RAND()), DATE_ADD(CURRENT_TIMESTAMP(),INTERVAL 10 MINUTE));');
			return $this->database->query('SELECT tokken FROM tokkens WHERE user_id = '.$id.' ORDER BY valid_until DESC LIMIT 1')[0]['tokken'];
		}

		public function is_user_valid($username, $password) {
			$res = $this->database->query("SELECT password FROM user WHERE `enabled` = 1 AND username = '".$username."' LIMIT 1;");
			if (empty($res)) { return false; }
			$hash = $res[0]['password'];

			return crypt($password, $hash) == $hash;
		}

		public function is_tokken_valid($tokken) {
			return $this->database->query('SELECT `valid_until` <= CURRENT_TIMESTAMP() AS "res" FROM `tokkens` WHERE `tokken` = "'.$tokken.'";')[0]['res'];
		}

		public function disable_tokken($tokken) {
			return $this->database->query("UPDATE tokkens SET enabled = 0 WHERE tokken = '".$tokken."';");
		}

		public function join_tokken($tokken, $bet) {
			// TODO: überprüfen ob 0 < bet <= balance

			$res_game = $this->database->query("SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1;");
			if (count($this->database->query("SELECT id FROM player WHERE user_id = (SELECT user_id FROM tokkens WHERE tokken = '".$tokken."') AND game_id = ".$res_game[0]['id'].";")) > 0) { return; }

			if (count($res_game) == 0) {
				$this->database->query("INSERT INTO `game` VALUES();");
				$res_game = $this->database->query("SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1;");
			}

			$this->database->query("INSERT INTO `player`(`id`, `game_id`, `user_id`, `cards`, `bet`) VALUES (null, ".$res_game[0]['id'].", (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."'), '".rand(0, 3).",".rand(0, 13)." "."', ".$bet.");");
		}

		public function add_card($tokken) {
			$this->database->query("UPDATE `player` SET `cards` = CONCAT(`cards`, '".rand(0, 3).",".rand(0, 13)." "."') WHERE `game_id` = (SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1) AND `user_id` = (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."');");
		}
	}

	$api = new api("blackjack_multiplayer");
?>
