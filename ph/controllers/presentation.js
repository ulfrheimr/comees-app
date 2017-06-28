var Presentation = require('../models/presentation');

var savePresentation = (presentation) => {
  return new Promise((resolve, reject) => {
    var pr = new Presentation();
    pr.presentation = presentation.presentation;

    pr.save((err, pr) => {
      if (err) reject(err);

      resolve(pr);
    });
  });
}

var findPresentations = (query) => {
  return new Promise((resolve, reject) => {
    Presentation.find(query)
      .exec((err, cs) => {
        if (err) reject(err);

        resolve(cs);
      });
  });
}

Promise.all([findPresentations, savePresentation]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var p = {
  putPresentation: (req, res) => {
    savePresentation({
        presentation: req.body.presentation
      })
      .then((r) => {
        console.log(r);
        res.json({
          ok: 1,
          message: "Presentation added"
        });
      }).catch((err) => res.status(500).send(err));
  },
  getPresentations: (req, res) => {
    findPresentations({})
      .then(ps => {
        res.json({
          ok: 1,
          data: ps
        })
      })
      .catch((err) => res.status(500).send(err));
  }
}


module.exports = p;
