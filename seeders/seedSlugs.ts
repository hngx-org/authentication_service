import sequelize from "../config/db.config";

const User = sequelize.model("User");

const createSlug = async (slug: string): Promise<string> => {
  slug = slug.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space

  slug = slug.toLowerCase(); // convert string to lowercase

  slug = slug
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/-+/g, "-"); // remove consecutive hyphens

  // look if slug already exists
  const user = await User.findOne({ where: { slug } });

  // if slug already exists, check if the slug ends with a hyphen followed by a number
  if (user) {
    const firstPart = slug.split("-").slice(0, -1).join("-");
    const lastPart = slug.split("-").pop();

    // if slug ends with hyphen and number, increment the number
    if (lastPart?.match(/^[0-9]*$/)) {
      slug = `${firstPart}-${parseInt(lastPart) + 1}`;
      return await createSlug(slug);
    } else {
      // if slug does not end with hyphen and number, add a hyphen and 1
      slug = `${slug}-1`;
      return await createSlug(slug);
    }
  }

  return slug;
};

const seedSlugs = async () => {
  const users = await User.findAll();

  for (let user of users) {
    const slug = await createSlug(
      `${user.dataValues.firstName}-${user.dataValues.lastName}`.toLowerCase(),
    );

    await user.update({ slug });
  }
};

seedSlugs();
