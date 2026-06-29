const users = [
  { username: 'admin', password: '1234', name: 'Администратор' },
  { username: 'I.kenjibaev', password: '1234', name: 'Пользователь 1' },
  { username: 'user2', password: 'pass2', name: 'Пользователь 2' },
];

function checkUser(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

module.exports = { checkUser };