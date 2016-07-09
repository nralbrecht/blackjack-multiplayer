# Blackjack Multiplayer

This is a Blackjack Webapp in witch multiple user can play against the dealer in one shared lobby.
The game state is saved in a MySQL database and interfaced by PHP. The client side logic and rendering are handled by [React](https://facebook.github.io/react/).

## Get Started

1. Download [Normalize.css](http://necolas.github.io/normalize.css/) and copy it to ``/css``.
2. Import ``database.sql`` to your MySQL instance.
3. Modify username and password in ``api/database_wrapper.php``
4. Copy the directory to your web server with PHP 5+.

## Build

1. Install the [Node Package Manager](https://nodejs.org/) (bundled in node.js).
2. Install the packages: ``babel-cli`` and ``babel-preset-react``.
3. Transpile ``src/components.jsx`` and ``src/menu.jsx`` with the command ``babel --presets react /path/to/components.jsx --out-dir path/to/js/``.
