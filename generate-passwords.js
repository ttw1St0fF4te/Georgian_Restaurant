const bcrypt = require('bcrypt');

async function hashPasswords() {
  const passwords = {
    'admin': 'admin123',
    'manager_tbiliso': 'manager123', 
    'manager_batumi': 'manager123',
    'chef_mtskheta': 'chef123',
    'nino_guest': 'user123',
    'davit_customer': 'user123',
    'ana_foodlover': 'user123',
    'giorgi_traveler': 'user123',
    'mariam_local': 'user123',
    'alex_tourist': 'user123',
    'sophie_blogger': 'user123',
    'guest_user1': 'guest123',
    'guest_user2': 'guest123'
  };
  
  console.log('-- Обновление паролей пользователей');
  for (const [username, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE username = '${username}';`);
  }
  
  console.log('\n-- Пароли для тестирования:');
  for (const [username, password] of Object.entries(passwords)) {
    console.log(`${username}: ${password}`);
  }
}

hashPasswords().catch(console.error);