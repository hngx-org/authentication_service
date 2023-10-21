const User = require('./models/Users');

const ediSlugs = async () => {
  const users = await User.findAll();

  for (const user of users) {
    const slug = user.slug;

    // check if slug contains a suffix number. Number could be 1 or 2 digits
    const regex = /-\d{1,2}$/;
    if (regex.test(slug)) {
      // if the number is 1, remove the -1 suffix
      // else decrement the number by 1
      const newSlug =
        slug.slice(-2) === '-1'
          ? slug.slice(0, -2)
          : slug.slice(0, -1) + (parseInt(slug.slice(-1)) - 1);

      // update the slug
      await User.update({ slug: newSlug }, { where: { id: user.id } });
    }
  }
};

ediSlugs();
