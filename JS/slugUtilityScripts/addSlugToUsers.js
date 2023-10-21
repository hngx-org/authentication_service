const User = require('./models/Users');
const slugify = require('./helpers/slugify');

async function addSlugToUsers() {
  const users = await User.findAll();

  for (let i = 0; i < users.length; i++) {
    // create slug from first and last name
    let slug = await slugify(`${users[i].first_name} ${users[i].last_name}`);

    // insert slug into database
    slug = await insertSlugIntoDatabase(slug);

    // insert slug into database
    await users[i].update({ slug });
  }
}

async function insertSlugIntoDatabase(slug) {
  const count = await User.count({ where: { slug } });

  if (count === 0) {
    return slug;
  }

  // if slug already exists, increment last number and recurse
  const slugArray = slug.split('-');
  const lastDigit = slugArray[slugArray.length - 1];
  const newLastDigit = parseInt(lastDigit, 10) + 1;
  slugArray[slugArray.length - 1] = newLastDigit;
  slug = slugArray.join('-');

  return insertSlugIntoDatabase(slug);
}

addSlugToUsers();
