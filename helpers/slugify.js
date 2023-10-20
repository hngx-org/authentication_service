const User = require('../models/Users');

async function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space

  str = str.toLowerCase(); // convert string to lowercase

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '_') // replace spaces with hyphens
    .replace(/-+/g, '_'); // remove consecutive hyphens

  // check if slug already exists
  const count = await User.count({ where: { slug: str } });

  // if slug exists, append count to slug
  if (count) {
    str += '_' + count;
  }

  return str;
}

module.exports = slugify;
