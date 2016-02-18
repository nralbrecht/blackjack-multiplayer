var Card = React.createClass({
	displayName: 'Card',

	getSymbol: function (id) {
		switch (id) {
			case 0:
				return 'A';
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				return id++;
			case 10:
				return 'B';
			case 11:
				return 'D';
			case 12:
				return 'K';
			default:
				return id;
		}
	},
	getSuit: function (id) {
		switch (id) {
			case 0:
				return '♥';
			case 1:
				return '♦';
			case 2:
				return '♣';
			case 3:
				return '♠';
			default:
				return id;
		}
	},
	render: function () {
		return React.createElement(
			'li',
			{ className: 'card' },
			React.createElement(
				'div',
				{ className: 'card__top' },
				this.getSymbol(this.props.data[1])
			),
			React.createElement(
				'div',
				{ className: 'card__suit' },
				this.getSuit(this.props.data[0])
			),
			React.createElement(
				'div',
				{ className: 'card__bottom' },
				this.getSymbol(this.props.data[1])
			)
		);
	}
});

var User = React.createClass({
	displayName: 'User',

	render: function () {
		var cards = [];

		this.props.data.cardlist.map(function (card) {
			cards.push(React.createElement(Card, { key: Math.random(), data: card }));
		});

		if (this.props.data.isDealer) {
			return React.createElement(
				'div',
				{ className: 'row user user--orange' },
				React.createElement(
					'ul',
					{ className: 'user__info' },
					React.createElement(
						'li',
						{ className: 'user__name' },
						this.props.data.name
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'user__score' },
							this.props.data.score
						),
						' Punkte'
					)
				),
				React.createElement(
					'ul',
					{ className: 'user__cardlist' },
					cards
				)
			);
		} else {
			return React.createElement(
				'div',
				{ className: 'row user' },
				React.createElement(
					'ul',
					{ className: 'user__info' },
					React.createElement(
						'li',
						{ className: 'user__name' },
						this.props.data.name
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'user__score' },
							this.props.data.score
						),
						' Punkte'
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'user__balance' },
							this.props.data.balance
						),
						'€'
					)
				),
				React.createElement(
					'ul',
					{ className: 'user__cardlist' },
					cards
				)
			);
		}
	}
});

var PlainUserList = React.createClass({
	displayName: 'PlainUserList',

	render: function () {
		var users = [];

		this.props.data.map(function (user) {
			users.push(React.createElement(User, { key: user.name, data: user }));
		});

		return React.createElement(
			'div',
			{ className: 'userlist' },
			users
		);
	}
});

var Error = React.createClass({
	displayName: 'Error',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'row error' },
			this.props.message
		);
	}
});

var UserList = React.createClass({
	displayName: 'UserList',

	httpRequest: new XMLHttpRequest(),
	loadGameStateFromServer: function () {
		this.httpRequest.onreadystatechange = this.onreadystatechange;
		this.httpRequest.open('GET', this.props.url);
		this.httpRequest.send();
	},
	onreadystatechange: function (data) {
		if (this.httpRequest.readyState == 4 && this.httpRequest.status == 200) {
			this.setState(JSON.parse(this.httpRequest.responseText));
		} else if (this.httpRequest.readyState == 4 && this.httpRequest.status != 200) {
			this.setState({ "err": "Daten konnten nicht geladen werden." });
		};
	},
	getInitialState: function () {
		return { "err": "Daten konnten nicht geladen werden." };
	},
	componentDidMount: function () {
		this.loadGameStateFromServer();
		setInterval(this.loadGameStateFromServer, this.props.pollInterval);
	},

	render: function () {
		if (this.state.err) {
			return React.createElement(Error, { message: this.state.err });
		} else {
			return React.createElement(PlainUserList, { data: this.state.data });
		}
	}
});

React.render(React.createElement(UserList, { url: 'api/state.php', pollInterval: 3000 }), document.getElementById('userlist'));