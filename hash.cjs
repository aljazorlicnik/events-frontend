const bcrypt = require('bcrypt');
const passwords = ['user123', 'admin123'];
passwords.forEach(pw => {
    console.log(`${pw}: ${bcrypt.hashSync(pw, 10)}`);
});
