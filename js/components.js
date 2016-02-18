var Card = React.createClass({
	displayName: 'Card',

	getSymbol: function (id) {
		return ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'B', 'D', 'K'][id];
	},
	getSuit: function (id) {
		return ['♥', '♦', '♣', '♠'][id];
	},
	render: function () {
		return React.createElement(
			'li',
			{ className: 'card' },
			React.createElement(
				'div',
				{ className: 'card__top' },
				this.getSymbol(+this.props.data[1])
			),
			React.createElement(
				'div',
				{ className: 'card__suit' },
				this.getSuit(+this.props.data[0])
			),
			React.createElement(
				'div',
				{ className: 'card__bottom' },
				this.getSymbol(+this.props.data[1])
			)
		);
	}
});

var User = React.createClass({
	displayName: 'User',

	render: function () {
		var cards = [];

		var cardlist = this.props.data.cards.trimRight().split(' ').map(function (e) {
			return e.split(',');
		});
		cardlist.map(function (card, i) {
			cards.push(React.createElement(Card, { key: i, data: card }));
		});

		if (+this.props.data.is_dealer) {
			return React.createElement(
				'div',
				{ className: 'row user user--orange' },
				React.createElement(
					'ul',
					{ className: 'user__info' },
					React.createElement(
						'li',
						{ className: 'user__name' },
						this.props.data.username
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
						this.props.data.username
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

		this.props.data.map(function (user, i) {
			users.push(React.createElement(User, { key: i, data: user }));
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