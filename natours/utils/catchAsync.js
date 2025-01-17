// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}; //ovako pisem da se ne bi sama pozivala pa onda returnam novu fn i prosledjujem parametre
