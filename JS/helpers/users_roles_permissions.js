const roles = ['guest', 'user', 'admin'];

const product_permissions = [
  'product.create',
  'product.read',
  'product.update.own',
  'product.update.all',
  'product.delete.own',
  'product.delete.all',
];

const order_permissions = [
  'order.create',
  'order.read',
  'order.update.own',
  'order.update.all',
  'order.delete.own',
  'order.delete.all',
];

const coupon_permissions = [
  'coupon.create',
  'coupon.read',
  'coupon.update.own',
  'coupon.update.all',
  'coupon.delete.own',
  'coupon.delete.all',
];

const shop_permissions = [
  'shop.create',
  'shop.read',
  'shop.update.own',
  'shop.update.all',
  'shop.delete.own',
  'shop.delete.all',
];

const review_permissions = [
  'review.create',
  'review.read',
  'review.update.own',
  'review.update.all',
  'review.delete.own',
  'review.delete.all',
];

const portfolio_permissions = [
  'portfolio.create',
  'portfolio.read',
  'portfolio.update.own',
  'portfolio.update.all',
  'portfolio.delete.own',
  'portfolio.delete.all',
];

const assessment_permissions = [
  'assessment.create',
  'assessment.read',
  'assessment.update.own',
  'assessment.update.all',
  'assessment.delete.own',
  'assessment.delete.all',
];

const badge_permissions = [
  'badge.create',
  'badge.read',
  'badge.update.own',
  'badge.update.all',
  'badge.delete.own',
  'badge.delete.all',
];

const event_permissions = [
  'event.create',
  'event.read',
  'event.update.own',
  'event.update.all',
  'event.delete.own',
  'event.delete.all',
];

const guest_permissions = [
  'product.read',
  'coupon.read',
  'shop.read',
  'review.read',
  'portfolio.read',
  'assessment.read',
  'badge.read',
  'event.read',
  'order.create',
  'order.read',
  'order.update.own',
  'order.delete.own',
];

const user_permissions = [
  ...[
    ...product_permissions,
    ...order_permissions,
    ...coupon_permissions,
    ...shop_permissions,
    ...review_permissions,
    ...portfolio_permissions,
    ...assessment_permissions,
    ...badge_permissions,
    ...event_permissions,
  ].filter((permission) => !permission.includes('all')),
];

const all_permissions = [
  ...product_permissions,
  ...order_permissions,
  ...coupon_permissions,
  ...shop_permissions,
  ...review_permissions,
  ...portfolio_permissions,
  ...assessment_permissions,
  ...badge_permissions,
  ...event_permissions,
];

module.exports = {
  roles,
  product_permissions,
  order_permissions,
  coupon_permissions,
  shop_permissions,
  review_permissions,
  portfolio_permissions,
  assessment_permissions,
  badge_permissions,
  event_permissions,
  guest_permissions,
  user_permissions,
  all_permissions,
};
