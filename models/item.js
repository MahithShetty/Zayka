function item() {
    var helper = require('./helper');
    // var url = require('url');
    // var jwt = require('jsonwebtoken');
    var md5 = require('md5');

    
    this.get = function (req, res, next) {
        try {
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "select * from item";
                    conn.query(query, function (sqlError, result) {
                        if (sqlError) {
                            //console.error('SQL Error:', sqlError);
                            return next(sqlError);
                        }
                        if (result.length >= 1) {
                            res.send(helper.createResponse(helper.Success, helper.successStatusCode, helper.ResultMsg, result));
                        } else {
                            res.send(helper.createResponse(helper.Error, helper.errorStatusCode, helper.noResultMsg, ""));
                        }
                    });
                }
            });
        } catch (internalError) {
            //console.error("Internal error:" + internalError);
            return next(internalError);
        }
    };

    this.add = function (req, res, next) {
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var checkDuplication = "select * from item where itemName ='" + reqObj.itemName + "'";
                    // console.log(checkDuplication);
                    conn.query(checkDuplication, function (sqlError, checkDuplicateResult) {
                        if (sqlError) {
                            //console.error('Sql error:' + sqlError);
                            return next(sqlError);
                        }
                        if (checkDuplicateResult.length >= 1) {
                            res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Item already exists!', ''));
                        } else {
                            var insertSql = "INSERT INTO item SET ?";
                            var insertValues = {
                                'itemName': reqObj.itemName,
                                'cost': reqObj.cost,
                                'description': reqObj.description,

                            };
                            // console.log(insertSql);
                            conn.query(insertSql, insertValues, function (sqlError, result) {
                                if (sqlError) {
                                    //console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'item added successfully', result.insertID));
                                } else {
                                    res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while logging in!', ""));
                                }
                            });
                        }
                    });
                }
            });
        } catch (ex) {
            //console.error('Internal Server Error' + ex);
            next(ex);
        }
    };

    this.delete = function (req,res,next) {
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                            var query = "delete from item where itemName='"+reqObj.itemName+"'";

                            console.log(query);
                            conn.query(query, function (sqlError, result) {
                                if (sqlError) {
                                    //console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'item deleted successfully', result.insertID));
                                } else {
                                    res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while deleting the item', ""));
                                }
                            });
                }
            });
        } catch (ex) {
            //console.error('Internal Server Error' + ex);
            next(ex);
        }
    }

    this.updateCost =  function (req, res, next) {
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {

                    var query = "update item set cost = " +reqObj.cost+" where itemName ='"+reqObj.itemName+"'";
                    console.log(query);
                            conn.query(query, function (sqlError, result) {
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'item cost successfully updated', result.insertID));
                                } else {
                                    res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while updating the cost!', ""));
                                }
                            });
                        }
                    });
        } catch (ex) {
            console.error('Internal Server Error' + ex);
            next(ex);
        }
    };
}

module.exports = new item();