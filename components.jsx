var data = [
	{"name": "Dealer","isDealer": true,"score": 10,"cardlist": [[0, 11]]},
	{"name": "nralbrecht","isDealer": false,"balance":"1000","score": 14,"cardlist": [[0, 11],[2, 3],[1, 1]]},
	{"name": "schwartz","isDealer": false,"balance":"​1000","score": 18,"cardlist": [[2, 10],[2, 2],[1, 6]]}
];

var Card = React.createClass({
	getSymbol: function(id) {
		switch (id) {
			case 0:
				return('A');
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				return(id++);
			case 10:
				return('B');
			case 11:
				return('D');
			case 12:
				return('K');
			default:
				return(id);
		}
	},
	getSuit: function(id) {
		switch (id) {
			case 0:
				return('♥');
			case 1:
				return('♦');
			case 2:
				return('♣');
			case 3:
				return('♠');
			default:
				return(id);
		}
	},
	render: function() {
		return(
			<li className="card">
				<div className="card__top">{this.getSymbol(this.props.data[1])}</div>
				<div className="card__suit">{this.getSuit(this.props.data[0])}</div>
				<div className="card__bottom">{this.getSymbol(this.props.data[1])}</div>
			</li>
		);
	}
});

var User = React.createClass({
	render: function() {
		var cards = [];

		this.props.data.cardlist.map(function(card) {
			cards.push(<Card key={Math.random()}  data={card} />);
		});

		if (this.props.data.isDealer) {
			return (
				<div className="row user user--orange">
					<ul className="user__info">
						<li className="user__name">{this.props.data.name}</li>
						<li><span className="user__score">{this.props.data.score}</span> Punkte</li>
					</ul>
					<ul className="user__cardlist">{cards}</ul>
				</div>
			);
		} else {
			return (
				<div className="row user">
					<ul className="user__info">
						<li className="user__name">{this.props.data.name}</li>
						<li><span className="user__score">{this.props.data.score}</span> Punkte</li>
						<li><span className="user__balance">{this.props.data.balance}</span>&euro;</li>
					</ul>
					<ul className="user__cardlist">{cards}</ul>
				</div>
			);
		}
	}
});

var UserList = React.createClass({
	render: function() {
		var users = [];

		this.props.data.map(function(user) {

			users.push(<User key={user.name} data={user} />);
		});

		return(
			<div className="userlist">{users}</div>
		);
	}
});

React.render(
	<UserList data={data} />,
	document.getElementById('userlist')
);