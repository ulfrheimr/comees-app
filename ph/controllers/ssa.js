var ssas = ["I", "II", "III"];

var SSAs = () => {
  return new Promise((resolve, reject) => {
    resolve(ssas);
  });
}

Promise.all([SSAs]).catch((error) => {
  console.log(error);
  return Promise.reject(error.message || error);
});

var s = {

  getSSAs: (req, res) => {
    SSAs()
      .then(ssas => {
        res.json({
          ok: 1,
          data: ssas
        })
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}


module.exports = s;
