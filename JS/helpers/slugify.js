const User = require('../models/Users');

async function slugify( firstname, lastname ) {
  str = firstname + "-" + lastname;
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space

  str = str.toLowerCase(); // convert string to lowercase

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/-+/g, '-'); // remove consecutive hyphens

  // check if slug already exists
  User.count({ where: { first_name: firstname, last_name: lastname } }).then(res => {
    const count = res;

    // if slug exists, append count to slug
    if (count) {
      str += '-' + count;
    }

    return str;
  })

}

module.exports = slugify;
