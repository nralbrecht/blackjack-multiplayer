<?php
	include 'database_wrapper.php';

	class api
	{
		private $database;

		public function __construct($dbname) {
			$this->database = new DatabaseWrapper($dbname);
		}

		public function get_user_balance($username) {
			return $this->database->query("SELECT `balance` FROM `user` WHERE `enabled` = 1 AND `username` = '".$username."' LIMIT 1;")[0]['balance'];
		}

		public function get_tokken($username) {
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

		public function register_user($username, $password) {

			if ($this->database->query("SELECT COUNT(`id`) AS 'count' FROM `user` WHERE `username` = '".$username."'")[0]['count'] > 0) {
				return "EXISTS";
			} else {
				if ($this->database->query("INSERT INTO `user`(`username`, `password`) VALUES ('".$username."','".$password."');")) {
					return "CREATED";
				} else {
					return "DUPLICATED_USERNAME";
				}
			}
		}

		public function is_user_valid($username, $password) {
			$res = $this->database->query("SELECT `password` FROM `user` WHERE `enabled` = 1 AND username = '".$username."' LIMIT 1;");
			if (empty($res)) { return false; }
			$hash = $res[0]['password'];

			$is_valid = crypt($password, $hash) == $hash;
			if ($is_valid) {
				$this->database->query("UPDATE `user` SET `last_login` = CURRENT_TIMESTAMP() WHERE `enabled` = 1 AND `username` = '".$username."' LIMIT 1;");
			}

			return $is_valid;
		}

		public function is_tokken_valid($tokken) {
			return $this->database->query('SELECT `valid_until` <= CURRENT_TIMESTAMP() AS "res" FROM `tokkens` WHERE `tokken` = "'.$tokken.'";')[0]['res'];
		}

		public function disable_tokken($tokken) {
			return $this->database->query("UPDATE tokkens SET enabled = 0 WHERE tokken = '".$tokken."';");
		}

		public function join_tokken($tokken, $bet) {
			// get id of runing game
			$res_game = $this->database->query("SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1;");

			if (count($res_game) == 0) {
				// start new game
				$this->database->query("INSERT INTO `game` VALUES();");
				$res_game = $this->database->query("SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1;");
			} else {
				if ($this->database->query("SELECT COUNT(`id`) AS 'count' FROM `player` WHERE `user_id` = (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."') AND `game_id` = ".$res_game[0]['id'].";")[0]['count'] > 0) {
					return "EXISTS";
				}
			}

			// bet is in range
			$balance = $this->database->query("SELECT `balance` FROM `user` WHERE `id` = (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."');")[0]['balance'];
			if ($bet < 1 || $bet > $balance) {
				return "BET_INVALID";
			}

			// insert new player with random cards
			$this->database->query("INSERT INTO `player`(`game_id`, `user_id`, `cards`, `bet`) VALUES (".$res_game[0]['id'].", (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."'), '".rand(0, 3).",".rand(0, 12)." ".rand(0, 3).",".rand(0, 12)." ', ".$bet.");");

			return "CREATED";
		}

		public function add_card($tokken) {
			$this->database->query("UPDATE `player` SET `cards` = CONCAT(`cards`, '".rand(0, 3).",".rand(0, 12)." ') WHERE `game_id` = (SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1) AND `user_id` = (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."');");
		}

		private function player_score($cards) {
			$lookup_list = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
			$cards = explode(' ', trim($cards));

			$output = 0;
			$output2 = 0;

			foreach ($cards as $card) {
				$symbol = substr($card, 2);

				if ($symbol == 0) {
					$output += 1;
					$output2 += 11;
				} else {
					$output += $lookup_list[$symbol];
					$output2 += $lookup_list[$symbol];
				}
			}
			return ($output < $output2)? $output : $output2;
		}

		private function player_has_won($cards) {
			$score = player_score($cards);

			// TODO: test vs. dealer

			return $score <= 21;
		}

		public function finish_round($tokken) {
			$this->database->query("UPDATE `player` SET `is_finished` = 1 WHERE `game_id` = (SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1) AND `user_id` = (SELECT `user_id` FROM `tokkens` WHERE `tokken` = '".$tokken."');");

			// if all player have finished
			if($this->database->query("SELECT COUNT(`id`) AS 'count' FROM `player` WHERE `game_id` = (SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1) AND `is_finished` = 0")[0]['count'] == 0) {
				$players = $this->database->query("SELECT `user_id`, `cards`, `bet` FROM `player` WHERE `game_id` = (SELECT `id` FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1) AND `is_finished` = 1");
				$this->database->query("UPDATE `game` SET `end_time` = CURRENT_TIMESTAMP() WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1");

				foreach ($players as $player) {
					if ($this->player_has_won($player['cards'])) {
						$this->database->query("UPDATE `user` SET `balance` = `balance` + ".$player['bet']." WHERE `id` = '".$player['user_id']."';");
					} else {
						$this->database->query("UPDATE `user` SET `balance` = `balance` - ".$player['bet']." WHERE `id` = '".$player['user_id']."';");
					}
				}
			}
		}

		public function get_state()	{
			if ($this->database->query('SELECT COUNT(`id`) AS "count" FROM `game` WHERE `end_time` IS NULL ORDER BY(`start_time`) DESC LIMIT 1')[0]['count'] < 1) {
				return ['err' => 'Es läuft gerade kein Spiel.', 'data' => null];
			}

			$data = $this->database->query('SELECT u.`username`, 0 AS "is_dealer", u.`balance`, p.`cards`, p.`is_finished` FROM `player` p JOIN `user` u ON p.`user_id` = u.`id` WHERE p.`game_id` = (	SELECT g.`id` FROM `game` g WHERE g.`end_time` IS NULL ORDER BY(g.`start_time`) DESC LIMIT 1)');

			for ($i=0; $i < count($data); $i++) {
				$data[$i]['score'] = $this->player_score($data[$i]['cards']);
			}

			$output = [
				'err' => null,
				'data' => $data
			];

			return $output;
		}
	}

	$api = new api("blackjack_multiplayer");
?>
