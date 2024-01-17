module.exports = function app(user) {
	return `
	 <!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Median - Homepage</title>
		<link rel="stylesheet" href="/app.css"/>

	</head>
	<body>
		<div id="mySidenav" class="sidenav">
			<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
			<a href="#">About</a>
			<a href="#">Services</a>
			<a href="#">Clients</a>
			<a href="#">Contact</a>
		</div>

		<!-- Use any element to open the sidenav -->
		<span onclick="openNav()" id="menuopen">☰</span>
		<!-- Replace the existing <main> content with this -->

		<main id="main">
			<div id="profile-info">
					<h2>${user.username}</h2>
					<p>${user.bio || "No Bio Yet! Go to settings to create one."}</p>
				<a href="/startdebate?sessionID=${
					user.currentSessionID
				}" class="start-debate-button">Start a debate</a>
			</div>


				<!-- Enhanced Dashboard Section -->
				<div id="dashboard">
						<h3>Your Debate Dashboard</h3>
						<div class="dashboard-item">
								<div class="dashboard-header">
										<h4>Total Debates</h4>
										<span class="dashboard-icon">🗣️</span>
								</div>
								<p>${user.totalDebates}</p>
						</div>
						<div class="dashboard-item">
								<div class="dashboard-header">
										<h4>Wins</h4>
										<span class="dashboard-icon">🏆</span>
								</div>
								<p>${user.wins}</p>
						</div>
						<div class="dashboard-item">
								<div class="dashboard-header">
										<h4>Losses</h4>
										<span class="dashboard-icon">😞</span>
								</div>
								<p>${user.losses}</p>
						</div>

						<div class="dashboard-item">
								<div class="dashboard-header">
										<h4>Win Streak</h4>
										<span class="dashboard-icon">🔥</span>
								</div>
								<p>Current Streak: ${user.winStreak}</p>
						</div>

						<div class="dashboard-item">
								<div class="dashboard-header">
										<h4>Favorite Topic</h4>
										<span class="dashboard-icon">🌐</span>
								</div>
								<p>${
									user.favoriteTopic ||
									"Go to settings to configure your favorite topic."
								}</p>
						</div>
					<div id="achievements">
							<h3>Your Achievements</h3>
							${user.achievementsHTML || "No achievements yet! Keep working hard."}
							<!-- <div class="achievement" id="achievement-wins">
									<h4>Victorious</h4>
									<p>Won 10 debates</p>
							</div> -->
							<!-- Add more achievements as needed -->
					</div>
				</div>
		</main>


		<script src="app.js"></script>
	</body>
	</html>`
}