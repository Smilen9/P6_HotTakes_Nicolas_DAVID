//-------------- Regex du mail
const alert = require ('alert');

module.exports = (req, res, next) => {
    const validEmail = (email) => {
        let emailRegexp = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/
        let isRegexTrue = emailRegexp.test(email)
        isRegexTrue ? next() : res.status(400).json(alert('mail non valide')); // ? = IF et : = ELSE
    }
    validEmail(req.body.email)
  };