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
				{ classfor: "username" },
				"Benutzername:",
				React.createElement("input", { type: "text", name: "username", value: this.state.username, onChange: this.handleChange })
			),
			React.createElement(
				"label",
				{ "for": "password" },
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

var Dropdown = React.createClass({
	displayName: "Dropdown",

	render: function () {
		if (this.props.action == "CLOSE") {
			return null;
		} else if (this.props.action == "LOGIN") {
			return React.createElement(LoginDropdown, null);
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
		console.log("not_implemented");
	},
	logout: function () {
		ajax_get('api/logout.php?tokken=' + user_info.tokken, true);
		user_info = null;
		menu_rerender();
	},
	openSetings: function () {
		console.log("not_implemented");
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
						{ onClick: this.openSetings },
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
						{ onClick: this.openLogin },
						"Registrieren"
					)
				)
			);
		}
	}
});

var menu_rerender = function () {
	React.render(React.createElement(NavigationItemList, { data: user_info }), document.getElementsByTagName('nav')[0].getElementsByClassName('navigation__itemlist')[0]);
	React.render(React.createElement(Dropdown, { action: "CLOSE" }), document.getElementById('dropdown'));
};

menu_rerender();