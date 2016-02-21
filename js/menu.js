var ajax_get = function (path, async) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', path, async);
	httpRequest.send();

	if (!async) {
		return {
			"successfull": httpRequest.status >= 200 && httpRequest.status < 300 ? true : false,
			"res": httpRequest.responseText,
			"status": httpRequest.status
		};
	}
};

var user_info = null;

/* MENU */
var LoginDropdown = React.createClass({
	displayName: "LoginDropdown",

	login: function () {
		user_info = JSON.parse(ajax_get('api/login.php?username=' + this.state.username + '&password=' + this.state.password, false).res);

		menu_rerender();
	},
	getInitialState: function () {
		return { username: '', password: '' };
	},
	handleChange: function (event) {
		if (event.target.name == 'username') {
			this.setState({ username: event.target.value });
		} else if (event.target.name == 'password') {
			this.setState({ password: event.target.value });
		}
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "dropdown__content" },
			React.createElement(
				"h4",
				null,
				"Login"
			),
			React.createElement(
				"label",
				null,
				"Benutzername:",
				React.createElement("input", { type: "text", name: "username", value: this.state.username, onChange: this.handleChange })
			),
			React.createElement(
				"label",
				null,
				"Passwort:",
				React.createElement("input", { type: "password", name: "password", value: this.state.password, onChange: this.handleChange })
			),
			React.createElement(
				"a",
				{ className: "button", onClick: this.login },
				"Anmelden"
			)
		);
	}
});

var RegisterDropdown = React.createClass({
	displayName: "RegisterDropdown",

	register: function () {
		ajax_get('api/register.php?username=' + this.state.username + '&password=' + this.state.password + '&password2=' + this.state.password2, false);

		menu_rerender();
	},
	getInitialState: function () {
		return { username: '', password: '', password2: '' };
	},
	handleChange: function (event) {
		if (event.target.name == 'username') {
			this.setState({ username: event.target.value });
		} else if (event.target.name == 'password') {
			this.setState({ password: event.target.value });
		} else if (event.target.name == 'password2') {
			this.setState({ password2: event.target.value });
		}
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "dropdown__content" },
			React.createElement(
				"h4",
				null,
				"Registrieren"
			),
			React.createElement(
				"label",
				null,
				"Benutzername:",
				React.createElement("input", { type: "text", name: "username", value: this.state.username, onChange: this.handleChange })
			),
			React.createElement(
				"label",
				null,
				"Passwort:",
				React.createElement("input", { type: "password", name: "password", value: this.state.password, onChange: this.handleChange })
			),
			React.createElement(
				"label",
				null,
				"Passwort wiederholen:",
				React.createElement("input", { type: "password", name: "password2", value: this.state.password2, onChange: this.handleChange })
			),
			React.createElement(
				"a",
				{ className: "button", onClick: this.register },
				"Registrieren"
			)
		);
	}
});

var Dropdown = React.createClass({
	displayName: "Dropdown",

	render: function () {
		if (this.props.action == "CLOSE") {
			return null;
		} else if (this.props.action == "LOGIN") {
			return React.createElement(LoginDropdown, null);
		} else if (this.props.action == "REGISTER") {
			return React.createElement(RegisterDropdown, null);
		}
	}
});

var NavigationItemList = React.createClass({
	displayName: "NavigationItemList",

	dropdown_is_open: false,
	openLogin: function () {
		if (this.dropdown_is_open) {
			React.render(React.createElement(Dropdown, { action: "CLOSE" }), document.getElementById('dropdown'));
			this.dropdown_is_open = false;
		} else {
			React.render(React.createElement(Dropdown, { action: "LOGIN" }), document.getElementById('dropdown'));
			this.dropdown_is_open = true;
		}
	},
	openRegister: function () {
		if (this.dropdown_is_open) {
			React.render(React.createElement(Dropdown, { action: "CLOSE" }), document.getElementById('dropdown'));
			this.dropdown_is_open = false;
		} else {
			React.render(React.createElement(Dropdown, { action: "REGISTER" }), document.getElementById('dropdown'));
			this.dropdown_is_open = true;
		}
	},
	logout: function () {
		ajax_get('api/logout.php?tokken=' + user_info.tokken, true);
		user_info = null;
		menu_rerender();
	},
	render: function () {
		if (user_info) {
			return React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ onClick: this.logout },
						"Abmelden"
					)
				),
				React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						null,
						user_info.username + '(' + user_info.balance + '€)'
					)
				)
			);
		} else {
			return React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ onClick: this.openLogin },
						"Login"
					)
				),
				React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ onClick: this.openRegister },
						"Registrieren"
					)
				)
			);
		}
	}
});

/* CONTROLLS */
var game_bet = null;

var GameControlls = React.createClass({
	displayName: "GameControlls",

	add_card: function () {
		ajax_get('api/add_card.php?tokken=' + user_info.tokken, true);
	},
	finish: function () {
		ajax_get('api/finish_round.php?tokken=' + user_info.tokken, true);

		game_bet = null;
		// TODO: update player balance
		// TODO: display win/los msg

		menu_rerender();
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "controll_content" },
			React.createElement(
				"div",
				{ className: "controll__title row" },
				"Bedienung"
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"a",
					{ className: "button controll__button", onClick: this.add_card },
					"Karte ziehen"
				),
				React.createElement(
					"a",
					{ className: "button controll__button", onClick: this.finish },
					"Aufhören"
				)
			)
		);
	}
});
var JoinControll = React.createClass({
	displayName: "JoinControll",

	getInitialState: function () {
		return { bet: '' };
	},
	handleChange: function (event) {
		this.setState({ bet: event.target.value });
	},
	join: function () {
		console.log(this.state.bet);
		if (Number.isInteger(+this.state.bet)) {
			ajax_get('api/join.php?tokken=' + user_info.tokken + '&bet=' + this.state.bet, true);

			game_bet = this.state.bet;
			menu_rerender();
		}
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "controll_content" },
			React.createElement(
				"div",
				{ className: "controll__title row" },
				"Spiel betreten"
			),
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"label",
					null,
					React.createElement("input", { type: "text", name: "bet", placeholder: "10€", value: this.state.bet, onChange: this.handleChange })
				),
				React.createElement(
					"a",
					{ className: "button controll__button", onClick: this.join },
					"Spiel betreten"
				)
			)
		);
	}
});

var Controlls = React.createClass({
	displayName: "Controlls",

	render: function () {
		if (user_info) {
			if (game_bet) {
				return React.createElement(GameControlls, null);
			} else {
				return React.createElement(JoinControll, null);
			}
		} else {
			return null;
		}
	}
});

var menu_rerender = function () {
	React.render(React.createElement(NavigationItemList, null), document.getElementsByTagName('nav')[0].getElementsByClassName('navigation__itemlist')[0]);
	React.render(React.createElement(Dropdown, { action: "CLOSE" }), document.getElementById('dropdown'));
	React.render(React.createElement(Controlls, null), document.getElementById('controlls'));
	dropdown_is_open = false;
};

menu_rerender();