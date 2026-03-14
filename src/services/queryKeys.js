export const queryKeys = {
  categories: () => ['categories'],
  posts: (params = {}) => ['posts', params],
  publicCategories: () => ['public-categories'],
  publicPosts: (params = {}) => ['public-posts', params],
  publicPost: (slug) => ['public-post', slug],
  videos: () => ['videos'],
  mostRead: () => ['most-read'],
  weather: () => ['weather'],
  exchangeRates: () => ['exchange-rates'],
  users: () => ['users'],
}
