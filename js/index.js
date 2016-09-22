'use strict';

var Leaderboard = React.createClass({
  displayName: 'Leaderboard',

  // Set up array property to store data from _ajax
  storedData: [],

  getInitialState: function getInitialState() {
    return {
      'recent': true,
      'ready': false
    };
  },

  componentDidMount: function componentDidMount() {
    // preload data on mount
    this._ajax(this.props.recent);
    this._ajax(this.props.alltime);
  },

  _ajax: function _ajax(url) {
    var _this = this;

    console.log('Fetching new data...');

    var callback = function callback(res) {
      // Adds array received from FreeCodeCamp API
      _this.storedData = _this.storedData.concat(res.data);
      // Sets ready to true to render first data (recent)
      _this.setState({ 'ready': true });
    };

    axios.get(url).then(callback).catch(function (err) {
      console.log(err);
    });
  },

  handleRecent: function handleRecent() {
    // Do nothing if Recent is already active
    if (this.state.recent) return;

    this.setState({ 'recent': !this.state.recent });
  },

  handleAlltime: function handleAlltime() {

    if (!this.state.recent) return;

    this.setState({ 'recent': !this.state.recent });
  },

  render: function render() {
    var recentHeader = 'Recent';
    var alltimeHeader = 'All';

    // Adds down arrow next to active sorting header
    if (this.state.recent) {
      recentHeader += '▾';
    } else {
      alltimeHeader += '▾';
    }

    // Contains main table and navbar (for use on small screens and mobile)
    return React.createElement(
      'div',
      { id: 'base' },
      React.createElement(
        'nav',
        { id: 'mobileNav', className: 'nav navbar navbar-default navbar-fixed-top' },
        React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: this.props.columns.position },
              '#'
            ),
            React.createElement(
              'div',
              { className: this.props.columns.username },
              'Username'
            ),
            React.createElement(
              'div',
              { className: this.props.columns.points, onClick: this.handleRecent },
              recentHeader
            ),
            React.createElement(
              'div',
              { className: this.props.columns.points, onClick: this.handleAlltime },
              alltimeHeader
            )
          )
        )
      ),
      React.createElement(
        'table',
        { id: 'mainTable', className: 'container' },
        React.createElement(
          'thead',
          { className: 'container' },
          React.createElement(
            'tr',
            { id: 'headers', className: 'row' },
            React.createElement(
              'th',
              { scope: 'col', id: 'leftCorner', className: this.props.columns.position },
              '#'
            ),
            React.createElement(
              'th',
              { scope: 'col', className: this.props.columns.username },
              'Username'
            ),
            React.createElement(
              'th',
              { scope: 'col', className: this.props.columns.points, onClick: this.handleRecent },
              recentHeader
            ),
            React.createElement(
              'th',
              { scope: 'col', id: 'rightCorner', className: this.props.columns.points, onClick: this.handleAlltime },
              alltimeHeader
            )
          )
        ),
        React.createElement(Users, { data: this.storedData, sorting: this.state.recent ? 'recent' : 'alltime', columns: this.props.columns }),
        ';'
      )
    );
  }
});

var Users = React.createClass({
  displayName: 'Users',

  // Takes array and outputs top 25 user of designated sorting method
  _sortArray: function _sortArray(array, sorting) {
    var _this2 = this;

    var tempObj = {};

    // Populates temp object with the number of points of users as keys
    array.forEach(function (data) {
      tempObj[data[sorting]] = data;
    });

    // Takes array of points/keys and sorts them from largest to smallest
    return Object.keys(tempObj).sort(function (a, b) {
      // Sort numerically
      return a - b;
    }).reverse().map(function (key, i) {
      // Add position property used for display and key(React)
      tempObj[key]['position'] = i + 1;

      // Places object into an array
      return tempObj[key];
    }).splice(0, 25).map(function (data) {
      // returns top 25 users (of set brownie points)
      return React.createElement(User, {
        key: data.position,
        username: data.username,
        avatar: data.img,
        recent: data.recent,
        alltime: data.alltime,
        position: data.position,
        columns: _this2.props.columns
      });
    });
  },

  // Renders 'Loading...' until data array is filled. Then populates table with User components
  render: function render() {
    if (this.props.data.length === 0) return React.createElement(
      'tbody',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'Loading...'
        )
      )
    );

    var users = this._sortArray(this.props.data, this.props.sorting);

    return React.createElement(
      'tbody',
      { className: 'container' },
      users
    );
  }
});

var User = React.createClass({
  displayName: 'User',

  // Renders each row for a user in the table
  render: function render() {
    var userLink = "https://freecodecamp.com/" + this.props.username;

    return React.createElement(
      'tr',
      { className: 'row' },
      React.createElement(
        'td',
        { className: this.props.columns.position },
        this.props.position
      ),
      React.createElement(
        'td',
        { className: this.props.columns.username },
        React.createElement(
          'a',
          { href: userLink },
          React.createElement('img', { alt: 'avatar', src: this.props.avatar }),
          React.createElement(
            'p',
            { className: 'username' },
            this.props.username
          )
        )
      ),
      React.createElement(
        'td',
        { className: this.props.columns.points },
        this.props.recent
      ),
      React.createElement(
        'td',
        { className: this.props.columns.points },
        this.props.alltime
      )
    );
  }
});

(function () {
  var RECENT = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
  var ALLTIME = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';
  // Bootstrap widths for Columns of table
  var columns = {
    position: 'col-md-1 col-sm-1 col-xs-1 positionClass',
    username: 'col-md-5 col-sm-5 col-xs-7 usernameClass',
    points: 'col-md-3 col-sm-3 col-xs-2 pointsClass'
  };

  ReactDOM.render(React.createElement(Leaderboard, { recent: RECENT, allTime: ALLTIME, columns: columns }), document.getElementById('react-root'));
})();