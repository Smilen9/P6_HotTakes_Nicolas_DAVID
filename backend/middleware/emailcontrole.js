//-------------- Regex du mail

module.exports = (req, res, next) => {
    const validEmail = (email) => {
        let emailRegexp =  /^[_Aa-Zz0-9-]+(.[_Aa-Zz0-9-]+)*@[Aa-Zz0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/
        let isRegexTrue = emailRegexp.test(email)
        isRegexTrue ? next() : res.status(400).json({ message: 'mail non valide' }); // ? = IF et : = ELSE
    }
    validEmail(req.body.email)
  };