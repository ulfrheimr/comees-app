var fs = require('fs');
var async = require('async');
var capitalize = require('capitalize');
var utf8 = require('utf8');
var iconv = require('iconv-lite');

var imp = require('./ph.v1');
var mi = require('./mi.v1');

var importedDrugs = []

function readFile(path) {
  var fileContents = fs.readFileSync(path, 'binary');
  var lines = fileContents.toString().split('\n');

  var items = lines.map((item) => {
    var i = item.replace("\r", "").split(",");

    return {
      code: i[0],
      name: i[1].toLowerCase(),
      substance: i[2].toLowerCase(),
      pres: i[3].toLowerCase(),
      dosage: i[4].toLowerCase(),
      qty: i[5],
      lab: i[6].toLowerCase(),
      price: i[7],
      max: i[8],
      ssa: i[9].split(' ')[i[9].split(" ").length - 1],
      desc: i[10].toLowerCase(),
      stock: i[11],
      cad: i[12],
      follow: false
    };
  })

  return items;
}

function getLabs(labs) {
  return new Promise((resolve, reject) => {
    imp.getLabs()
      .then((labsDB) => {
        async.map(labs,
          (i, callback) => {

            if (i in labsDB)
              callback(null, {
                lab: i.toLowerCase(),
                id: labsDB[i]
              });
            else {
              imp.putLab(i)
                .then((l) => {
                  callback(null, {
                    lab: l["lab"].toLowerCase(),
                    id: l["_id"]
                  });
                })
                .catch((err) => reject(err));
            }
          },
          (err, results) => {
            if (err) reject(err)

            var r = {}
            results.map((x) => {
              r[x["lab"]] = x["id"];
            })

            resolve(r);
          });
      })
      .catch((err) => reject(err));
  });
}

function getCats(cats) {
  return new Promise((resolve, reject) => {
    mi.getCats()
      .then((catsDB) => {

        async.map(cats,
          (c, callback) => {

            if (c.toLowerCase() in catsDB) {
              c = c.toLowerCase()
              callback(null, {
                cat: c,
                id: catsDB[c]
              });
            } else {

              mi.putCat(c)
                .then((cat) => {
                  callback(null, {
                    pres: cat["name"].toLowerCase(),
                    id: cat["_id"]
                  });
                })
                .catch((err) => reject(err));

            }
          },
          (err, results) => {
            if (err) reject(err);

            console.log(results);

            var r = {}
            results.map((x) => {
              r[x["name"]] = x["id"];
            })

            resolve(r);
          })
      })
      .catch((err) => reject(err));
  });
}

function getPress(press) {
  return new Promise((resolve, reject) => {
    imp.getPress()
      .then((pressDB) => {
        async.map(press,
          (p, callback) => {
            if (p in pressDB)
              callback(null, {
                pres: p.toLowerCase(),
                id: pressDB[p]
              });
            else {
              imp.putPress(p)
                .then((pres) => {
                  callback(null, {
                    pres: pres["presentation"].toLowerCase(),
                    id: pres["_id"]
                  });
                })
                .catch((err) => reject(err));
            }
          },
          (err, results) => {
            if (err) reject(err);

            var r = {}
            results.map((x) => {
              r[x["pres"]] = x["id"];
            })

            resolve(r);
          })
      })
      .catch((err) => reject(err));
  });
}

function getStock(d) {
  return new Promise((resolve, reject) => {
    imp.getStock(d)
      .then((d) => {
        resolve(d);
      })
      .catch((err) => reject(err));
  })

}

function getDrugs(drugs) {
  var current = drugs.pop();
  var resDrugs = []

  return new Promise((resolve, reject) => {
    getStock(current)
      .then((d) => {
        console.log("STOCK");
        console.log(d);
        if (drugs.length == 0) {
          resolve()
        } else {
          return getDrugs(drugs)
            .then((result) => {
              d["qty"] = current["stock"]

              importedDrugs.push(d)
              resolve(importedDrugs)
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => console.log(err));
  });

}

function addDrugsToPurchase(drugs, purchase) {
  return new Promise((resolve, reject) => {
    async.map(drugs,
      (item, callback) => {
        imp.addDrug(item, purchase)
          .then((r) => {
            callback(null, {
              ok: r.ok,
              id: item.code
            });
          })
          .catch((err) => reject(err));
      },
      (err, result) => {
        if (err) reject(err);

        resolve(result);
      }
    );
  });
}

function importDrugs(path, buy_place) {
  var items = readFile(path)

  getLabs([...new Set(items.map(i => capitalize.words(i["lab"])))])
    .then((labs) => {
      console.log("Correctly resolved labs \n");


      getPress([...new Set(items.map(i => capitalize.words(i["pres"])))])
        .then((press) => {
          console.log("Correctly resolved press\n");
          // console.log(press);

          var backDrugs = {}

          var drugs = items.map((drug) => {
            return {
              code: drug.code,
              name: capitalize.words(drug.name),
              substance: capitalize.words(drug.substance),
              id_presentation: press[drug.pres],
              dosage: drug.dosage,
              qty: 14,
              id_lab: labs[drug.lab],
              sale_price: 0,
              max_price: isNaN(drug.max_price) ? 0 : drug.max_price,
              cat: 16,
              ssa: drug.ssa,
              desc: drug.desc,
              stock: drug.stock,
              follow: drug.follow
            }
          })

          drugs.map((d) => {
            backDrugs[d["code"]] = d
          })

          getDrugs(drugs)
            .then((drugsStored) => {
              imp.getBuyPlace(buy_place)
                .then((bp) => {
                  console.log("Resolved buy place");
                  console.log(bp);
                  console.log("\n");

                  imp.createPurchase(bp.id)
                    .then((purchase) => {
                      console.log("Purchase referred:");
                      console.log(purchase);
                      console.log("\n");

                      addDrugsToPurchase(drugsStored, purchase.id)
                        .then((result) => {
                          result.map((r) => {
                            var rd = backDrugs[r.id]
                            console.log("Imported: " + rd["name"]);
                          })
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => {
              console.log("Error importing");
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// MIS
function readMis(path) {
  var fileContents = fs.readFileSync(path);
  var lines = fileContents.toString().split('\r');

  var items = lines
    .filter(x => x != "")
    .map((item) => {
      var i = item.split(",");
      return {
        name: i[0].toLowerCase(),
        cat: i[1].toLowerCase(),
        price: i[2],
        desc: i[3].toLowerCase(),
        available: parseInt(i[4]) == 1
      };
    })

  return items;
}

function importMis(path) {
  var items = readMis(path).slice(1);
  getCats([...new Set(items.map(i => capitalize.words(i['cat'])))])
    .then((catsDB) => {
      console.log("Correctly resolved MI cats");

      var diffItems = {};
      var repeated = [];
      items = items.filter(x => x.available);

      items.map((x) => {
        if (x.name in diffItems)
          repeated.push(x);
        else
          diffItems[x.name] = x;
      });

      async.map(items,
        (item, callback) => {
          mi.putMi(item)
            .then((res) => {
              callback(null, res);
            })
            .catch((err) => {
              console.log("There is an Error");
              console.log(err)
            })
        },
        (err, result) => {
          if (err) console.log(err)

          var res = result.map(x => x.ok)
            .reduce((x, y) => x && y, true);

          if (res)
            console.log("Everything is fine, you are able to kill yourself");
          else {
            console.log("Well, something is wrong");
            console.log(res);
          }

        });
    })
    .catch((err) => console.log(err));
}




importMis('/Users/rrivera/Desktop/svcs.csv')
// startImporting('/Users/ulfrheimr/Desktop/lst.csv', "amsa");
