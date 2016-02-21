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
				<label classfor="username">
					Benutzername:
					<input type="text" name="username" value={this.state.username} onChange={this.handleChange}></input>
				</label>
				<label for="password">
					Passwort:
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
				</label>
				<a className="button" onClick={this.login}>Anmelden</a>
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
		console.log("not_implemented");
	},
	logout: function() {
		ajax_get('api/logout.php?tokken=' + user_info.tokken, true);
		user_info = null;
		menu_rerender();
	},
	openSetings: function() {
		console.log("not_implemented");
	},
	render: function() {
		if (user_info) {
			return (
				<ul>
					<li>
						<a onClick={this.logout}>Abmelden</a>
					</li>
					<li>
						<a onClick={this.openSetings}>{user_info.username + '(' + user_info.balance + '€)'}</a>
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
						<a onClick={this.openLogin}>Registrieren</a>
					</li>
				</ul>
			);
		}
	}
});


var menu_rerender = function() {
	React.render(
		<NavigationItemList data={user_info}/>,
		document.getElementsByTagName('nav')[0].getElementsByClassName('navigation__itemlist')[0]
	);
	React.render(
		<Dropdown action="CLOSE"/>,
		document.getElementById('dropdown')
	);
};

menu_rerender();
