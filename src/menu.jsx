var ajax_get = function(path, async) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', path, async);
	httpRequest.send();

	if (!async) {
		return({
			"successfull": (httpRequest.status >= 200 && httpRequest.status < 300)? true:false,
			"res": httpRequest.responseText,
			"status": httpRequest.status
		});
	}
};

var user_info = null;

/* MENU */
var LoginDropdown = React.createClass({
	login: function() {
		user_info = JSON.parse(ajax_get('api/login.php?username=' + this.state.username + '&password=' + this.state.password, false).res);

		menu_rerender();
	},
	getInitialState: function() {
		return {username: '', password: ''};
	},
	handleChange: function(event) {
		if (event.target.name == 'username') {
			this.setState({username: event.target.value});
		} else if (event.target.name == 'password') {
			this.setState({password: event.target.value});
		}
	},
	render: function() {
		return(
			<div className="dropdown__content">
				<h4>Login</h4>
				<label>
					Benutzername:
					<input type="text" name="username" value={this.state.username} onChange={this.handleChange}></input>
				</label>
				<label>
					Passwort:
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
				</label>
				<a className="button" onClick={this.login}>Anmelden</a>
			</div>
		);
	}
});

var RegisterDropdown = React.createClass({
	register: function() {
		ajax_get('api/register.php?username=' + this.state.username + '&password=' + this.state.password + '&password2=' + this.state.password2, false);

		menu_rerender();
	},
	getInitialState: function() {
		return {username: '', password: '', password2: ''};
	},
	handleChange: function(event) {
		if (event.target.name == 'username') {
			this.setState({username: event.target.value});
		} else if (event.target.name == 'password') {
			this.setState({password: event.target.value});
		} else if (event.target.name == 'password2') {
			this.setState({password2: event.target.value});
		}
	},
	render: function() {
		return(
			<div className="dropdown__content">
				<h4>Registrieren</h4>
				<label>
					Benutzername:
					<input type="text" name="username" value={this.state.username} onChange={this.handleChange}></input>
				</label>
				<label>
					Passwort:
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
				</label>
				<label>
					Passwort wiederholen:
					<input type="password" name="password2" value={this.state.password2} onChange={this.handleChange}></input>
				</label>
				<a className="button" onClick={this.register}>Registrieren</a>
			</div>
		);
	}
});

var Dropdown = React.createClass({
	render: function() {
		if (this.props.action == "CLOSE") {
			return(null);
		} else if(this.props.action == "LOGIN") {
			return(
				<LoginDropdown />
			);
		} else if(this.props.action == "REGISTER") {
			return(
				<RegisterDropdown />
			);
		}
	}
});

var NavigationItemList = React.createClass({
	dropdown_is_open: false,
	openLogin: function() {
		if (this.dropdown_is_open) {
			React.render(
				<Dropdown action="CLOSE"/>,
				document.getElementById('dropdown')
			);
			this.dropdown_is_open = false;
		} else {
			React.render(
				<Dropdown action="LOGIN"/>,
				document.getElementById('dropdown')
			);
			this.dropdown_is_open = true;
		}
	},
	openRegister: function() {
		if (this.dropdown_is_open) {
			React.render(
				<Dropdown action="CLOSE"/>,
				document.getElementById('dropdown')
			);
			this.dropdown_is_open = false;
		} else {
			React.render(
				<Dropdown action="REGISTER"/>,
				document.getElementById('dropdown')
			);
			this.dropdown_is_open = true;
		}
	},
	logout: function() {
		ajax_get('api/logout.php?tokken=' + user_info.tokken, true);
		user_info = null;
		menu_rerender();
	},
	render: function() {
		if (user_info) {
			return (
				<ul>
					<li>
						<a onClick={this.logout}>Abmelden</a>
					</li>
					<li>
						<a>{user_info.username + '(' + user_info.balance + '€)'}</a>
					</li>
				</ul>
			);
		} else {
			return (
				<ul>
					<li>
						<a onClick={this.openLogin}>Login</a>
					</li>
					<li>
						<a onClick={this.openRegister}>Registrieren</a>
					</li>
				</ul>
			);
		}
	}
});

/* CONTROLLS */
var game_bet = null;

var GameControlls = React.createClass({
	add_card: function() {
		ajax_get('api/add_card.php?tokken=' + user_info.tokken, true);
	},
	finish: function() {
		ajax_get('api/finish_round.php?tokken=' + user_info.tokken, true);

		game_bet = null;
		// TODO: update player balance
		// TODO: display win/los msg

		menu_rerender();
	},
	render: function() {
		return(
			<div className="controll_content">
				<div className="controll__title row">Bedienung</div>
				<div className="row">
					<a className="button controll__button" onClick={this.add_card}>Karte ziehen</a>
					<a className="button controll__button" onClick={this.finish}>Aufhören</a>
				</div>
			</div>
		);
	}
});
var JoinControll = React.createClass({
	getInitialState: function() {
		return({bet: ''});
	},
	handleChange: function(event) {
		this.setState({bet: event.target.value});
	},
	join: function() {
		console.log(this.state.bet);
		if (Number.isInteger(+this.state.bet)) {
			ajax_get('api/join.php?tokken=' + user_info.tokken + '&bet=' + this.state.bet, true);

			game_bet = this.state.bet;
			menu_rerender();
		}
	},
	render: function() {
		return(
			<div className="controll_content" >
				<div className="controll__title row">Spiel betreten</div>
				<div className="row">
					<label>
						<input type="text" name="bet" placeholder="10€" value={this.state.bet} onChange={this.handleChange}></input>
					</label>
					<a className="button controll__button" onClick={this.join}>Spiel betreten</a>
				</div>
			</div>
		);
	}
});

var Controlls = React.createClass({
	render: function() {
		if (user_info) {
			if (game_bet) {
				return(
					<GameControlls />
				);
			} else {
				return(
					<JoinControll />
				);
			}
		} else {
			return(null);
		}
	}
});

var menu_rerender = function() {
	React.render(
		<NavigationItemList />,
		document.getElementsByTagName('nav')[0].getElementsByClassName('navigation__itemlist')[0]
	);
	React.render(
		<Dropdown action="CLOSE"/>,
		document.getElementById('dropdown')
	);
	React.render(
		<Controlls />,
		document.getElementById('controlls')
	);
	dropdown_is_open = false;
};

menu_rerender();
