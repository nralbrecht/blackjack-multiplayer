<!DOCTYPE html>
<html>
	<head>
		<!-- Meta -->
		<meta charset="utf8">
		<meta content='width=device-width, initial-scale=1' name='viewport'>
		<title>Blackjack Spiel</title>

		<!-- React -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>

		<!-- CSS -->
		<link rel="stylesheet" href="css/normalize.css">
		<link rel="stylesheet" href="css/milligram.min.css">
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,700">
	</head>
	<body>
		<nav class="navigation">
			<div class="container">
				<div class="row">
					<a href="./" class="navigation__title">Blackjack</a>
					<div class="column"></div>
					<ul class="navigation__itemlist">
						<li><a href="#" onclick="document.getElementById('dropdown').style.display=(document.getElementById('dropdown').style.display == 'none')? 'block':'none';">Login</a></li>
						<li><a href="#">Logout</a></li>
						<li><a href="#">Profil</a></li>
					</ul>
				</div>
				<div class="clearfix row">
					<div class="column"></div>
					<section id="dropdown" class="dropdown">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat.
					</section>
				</div>
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
 			<div id="userlist">
 				Bitte aktivieren sie JavaScript
			</div>
 		</main>
		<script src="components.js"></script>
	</body>
</html>