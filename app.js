var express = require("express");
var app = express();
var bodybuilder = require("bodybuilder");
var bodyParser = require("body-parser");
var _ = require('lodash')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const index = req.body.indexName;
  const filterTerms = req.body.filter || [];
  const orFilterTerms = req.body.orFilter || [];
  const notFilterTerms = req.body.notFilter || [];
  const aggregationBody = req.body.aggregation || [];



    const body = bodybuilder();
    body.query(req.body.query.option, req.body.query.field, req.body.query.value);

    const chainedFilter = filterTerms.reduce((filterBody, term) => {
        return filterBody.filter(term.option, term.field, term.value)
    }, body);
    const chainedOrFilter = orFilterTerms.reduce((filterBody, term) => {
        return filterBody.orFilter(term.option, term.field, term.value)
    }, body);
    const chainedNotFilter = notFilterTerms.reduce((filterBody, term) => {
        return filterBody.notFilter(term.option, term.field, term.value)
    }, body);
    body.aggregation(req.body.aggregationType, req.body.aggregationField,req.body.aggregationName,req.body.aggregationOptions ,(agg) => {
        _.forEach(aggregationBody, (aggregation) => {
            agg.aggregation(aggregation.aggregationType, aggregation.aggregationField, aggregation.aggregationName,aggregation.aggregationOptions);
        });
        return agg;
    });
    // res.send(JSON.parse(JSON.stringify(body.build(), null, 2)))
    let finalJson = body.build();
    //
    //
    res.send(finalJson)


})


app.listen(8080)

// .query('match', 'message', 'this is a test')
