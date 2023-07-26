const blacklist = [];

module.exports = {
  addToken: (token) => {
    blacklist.push(token);
  },
  isTokenBlacklisted: (token) => {
    return blacklist.includes(token);
  },
};
