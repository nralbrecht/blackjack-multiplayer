<?php
	class DatabaseWrapper
	{
		private $link;

		public function __construct($db_name) {
			$this->link = @mysqli_connect(
				"localhost"
				, "username"
				, "password"
				, $db_name
				, 3306
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
?>
