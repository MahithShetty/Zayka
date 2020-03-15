function customer_order() {
    var helper = require('../models/helper');
    var url = require('url');
    
    this.get = function (req, res, next) {
        try {
            var url_query = url.parse(req.url, true).query;
            var customerID = url_query.customerID;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "select i.itemName, o.qty, i.cost, o.orderID, c.status from item_order o , item i, customer_order c where o.ItemID = i.ItemID and o.customerID = "+ customerID+" and c.orderID=o.orderID and c.status>=1 order by o.orderID desc";
                    conn.query(query, function (sqlError, result) {
                        if (sqlError) {
                            console.error('SQL Error:', sqlError);
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
                    var checkDuplication = "select * from customer_order where customerID ='" + reqObj.customerID + "' ";
                    // console.log(checkDuplication);
                    conn.query(checkDuplication, function (sqlError, checkDuplicateResult) {
                        if (sqlError) {
                            //console.error('Sql error:' + sqlError);
                            return next(sqlError);
                        }
                        if (checkDuplicateResult.length <= 1) {
                            res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Customer doesnt exist!', ''));
                        } else {
                            var insertSql = "INSERT INTO customer_order SET ?";
                            var insertValues = {
                                'orderID': reqObj.orderID,
                                'customerID': reqObj.customerID,
                                'transactionID': reqObj.transactionID,
                            };
                            // console.log(insertSql);
                            conn.query(insertSql, insertValues, function (sqlError, result) {
                                if (sqlError) {
                                    //console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'Order added successfully', ""));
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

    this.updateStatusLocation = function (req, res, next) {
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                            var query = "update customer_order set status = 1, location = '"+reqObj.location+"' where orderID="+reqObj.orderID;
                            console.log(query);
                            conn.query(query, function (sqlError, result) {
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'Status/Location updated successfully', ""));
                                } else {
                                    res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while logging in!', ""));
                                }
                            });
                        }
                    });

        } catch (ex) {
            //console.error('Internal Server Error' + ex);
            next(ex);
        }
    };


//updates the customer order status ->2 (accepted) or status ->3 (rejected)
this.updateStatus = function (req, res, next) {
    try {
        var reqObj = req.body;
        req.getConnection(function (connectionError, conn) {
            if (connectionError) {
                console.error('SQL Connection Error:', connectionError);
                return next(connectionError);
            } else {
                        var query = "update customer_order set status = "+reqObj.status+" where orderID =" +reqObj.orderID;
                        console.log(query);
                        conn.query(query, function (sqlError, result) {
                            if (sqlError) {
                                console.error('Sql error:' + sqlError);
                                return next(sqlError);
                            }
                            if (result.affectedRows >= 1) {
                                res.send(helper.createResponse(helper.Success, helper.successStatusCode, ' updated successfully', ""));
                            } else {
                                res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while logging in!', ""));
                            }
                        });
                    }
                });

    } catch (ex) {
        //console.error('Internal Server Error' + ex);
        next(ex);
    }
};

//get all customer orders for the admin( if customer orders status -> 1 )
this.getAll = function (req, res, next) {
    try {
        var url_query = url.parse(req.url, true).query;
        var customerID = url_query.customerID;
        req.getConnection(function (connectionError, conn) {
            if (connectionError) {
                console.error('SQL Connection Error:', connectionError);
                return next(connectionError);
            } else {
                var query = "select i.itemName, o.qty, i.cost, o.orderID,c.customerID from item_order o , item i, customer_order c where o.ItemID = i.ItemID  and c.orderID=o.orderID and c.status=1 order by o.orderID asc";
                conn.query(query, function (sqlError, result) {
                    if (sqlError) {
                        console.error('SQL Error:', sqlError);
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
}

module.exports = new customer_order();