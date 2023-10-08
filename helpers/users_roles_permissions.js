/**
 * 1. create the roles
 * 2. Create permissions
 *
 */

//defining roles
const roles = ['Guest User', 'Registered User', 'Super Admin'];

//defining permissions
const permissions = [
  // products (shop and market place)
  'create product',
  'view product',
  'edit product',
  'delete own product',
  'delete any product',
  'view own products',
  'view all products',
  'use coupon',
  'access checkout',
  'purchase product',

  // working with orders
  'view own orders',
  'view all orders',
  'delete order',
  'create sales report',

  // coupons
  'create coupons',
  'delete coupons',
  'update own coupon',
  'update any coupon',
  'view own coupons',
  'view all coupons',
  'validate coupons',

  // shops
  'create shop',
  'update shop',
  'edit own shop',
  'edit all shops',
  'delete own shop',
  'delete any shop',
  'view all shops',
  'view own shop',

  // reviews and ratings
  'add review',
  'view all reviews',
  'delete own review',
  'delete all reviews',

  // portfolio
  'create portfolio',
  'update own portfolio',
  'update all portfolios',
  'view own portfolio',
  'view all portfolios',
  'delete own portfolio',
  'delete all portfolios',

  //assessment
  'create assessment',
  'view assessments',
  'edit assessments',
  'delete assessments',
  'take assessment',
  'view own results',
  'view all results',

  // badges
  'create badge',
  'edit badge',
  'delete badge',
  'view badge',
  'add badge to user',
  'remove badge from user',
  'assign badge to assessment',

  // events
  'create event',
  'delete own event',
  'delete all events',
  'edit event',
  'edit all events',
  'view events',

  // admin only
  'access vendor logs',
  'notify vendors',
  'add vendors',
  'delete vendors',
  'ban vendors',
  'unban vendors',
  'permanently delete products',
  'access products logs',
  'restore deleted products',
  'restore deleted vendors',
  'permanently delete vendors',

  // admin 2
  'generate reports',
  'handle complaints',
  'customer feedback',

  // authentication permissions
  'assign role',
  'assign permissions',
];

const guest_permissions = [
  'view product',
  'view all products',
  'use coupon',
  'view all shops',
  'view all portfolios',
  'view all reviews',
];

const user_permissions = [
  'create product',
  'view product',
  'edit product',
  'delete own product',
  'view own products',
  'view all products',
  'use coupon',
  'access checkout',
  'purchase product',
  'take assessment',
  'view own results',

  'view own orders',
  'delete order',
  'create sales report',
  'view all shops',

  'create portfolio',
  'update own portfolio',
  'view own portfolio',
  'view all portfolios',
  'delete own portfolio',
  'create event',
  'delete own event',
  'delete all events',
  'edit event',
  'edit all events',
  'view events',
];
module.exports = { permissions, roles, user_permissions, guest_permissions };
