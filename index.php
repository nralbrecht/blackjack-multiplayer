<!DOCTYPE html>
<html>
	<head>
		<!-- Meta -->
		<meta charset="utf8">
		<meta content='width=device-width, initial-scale=1' name='viewport'>
		<title>Blackjack Spiel</title>

		<!-- React -->
		<script src="js/react.min.js"></script>

		<!-- CSS -->
		<link rel="stylesheet" href="css/normalize.css">
		<link rel="stylesheet" href="css/milligram.min.css">
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="css/fonts.css">
	</head>
	<body>
		<nav class="navigation">
			<div class="container">
				<div class="row">
					<a href="./" class="navigation__title">Blackjack</a>
					<div class="column"></div>
					<div class="navigation__itemlist">
						<ul>
							<li>
								<a onclick="document.getElementById('dropdown').style.display=(document.getElementById('dropdown').style.display == 'none')? 'block':'none';">Login</a>
							</li>
							<li>
								<a onclick="document.getElementById('dropdown').style.display=(document.getElementById('dropdown').style.display == 'none')? 'block':'none';">Logout</a>
							</li>
						</ul>
					</div>
				</div>
				<div id="dropdown" style="display: none"></div>
			</div>
		</nav>
		<main class="container">
			<div class="controll">
				<div class="controll__title row">Bedienung</div>
				<div class="row">
					<a class="button controll__button" href="#">Karte ziehen</a>
					<a class="button controll__button" href="#">Aufhören</a>
				</div>
			</div>
			<div id="userlist"></div>
		</main>
		<script src="js/components.js"></script>
	</body>
</html>
