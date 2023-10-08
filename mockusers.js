const User = require('./models/Users');
const users = [
  {
    username: 'john_doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    section_order: 'some_section_order',
    password: 'hashed_password',
    provider: 'local',
    profile_pic: 'url_to_profile_pic',
    refresh_token: 'some_refresh_token',
    is_verified: true,
  },
  {
    username: 'jane_doe',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    section_order: 'another_section_order',
    password: 'hashed_password',
    provider: 'local',
    profile_pic: 'url_to_profile_pic',
    refresh_token: 'some_refresh_token',
    is_verified: true,
  },
];

module.exports = async () => {
  for (const user of users) {
    const createdUser = await User.create(user);
    console.log(createdUser);
  }
};
