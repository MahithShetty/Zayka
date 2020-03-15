function item_order() {
    var helper = require('../models/helper');
    var url = require('url');
    // var jwt = require('jsonwebtoken');
    var md5 = require('md5');

    
    this.get = function (req, res, next) {
        try {
            var url_query = url.parse(req.url, true).query;
            var customerID = url_query.customerID;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "select i.itemName, o.qty, i.cost, o.orderID from item_order o , item i, customer_order c where o.ItemID = i.ItemID and o.customerID ="+ customerID +" and c.orderID=o.orderID and c.status=0 order by o.orderID desc";
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
            // console.log(reqObj);
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else{
                    var insertOrder = "INSERT INTO customer_order SET ?";
                    var insertOrderValues = {
                        'customerID': reqObj.customerID,
                        // 'transactionID': reqObj.transactionID,
                    };
                    conn.query(insertOrder, insertOrderValues, function (sqlError, resultOrder) {
                        console.log(insertSql);
                        console.log(insertValues);
                        if (sqlError) {
                            console.error('Sql error:' + sqlError);
                            return next(sqlError);
                        }
                        if (resultOrder.affectedRows >= 1) {
                            var order_id=resultOrder.insertId;
                            // console.log(order_id);
                            var insertSql = "INSERT INTO item_order(orderID,customerID,itemID,qty) VALUES ?";
                            var insertValues = [], temp=[];
                            for(var i=0;i<reqObj.itemID.length;i+=2){
                                temp= [parseInt(order_id,10),parseInt(reqObj.customerID,10),parseInt(reqObj.itemID[i],10),parseInt(reqObj.qty[i],10)];
                                insertValues.push(temp);
                            }
                            conn.query(insertSql, [insertValues], function (sqlError, result) {
                                // console.log(insertSql);
                                // console.log(insertValues);
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'Order added successfully',""));
                                } else {
                                    res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Error while logging in!', ""));
                                }
                            });
                        }
                        else{
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

    this.updateLocation = function(req,res,next){
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                            var query = "update customer_order set location ="+reqObj.location+" where orderID = "+reqObj.orderID;
                            console.log(query);
                            conn.query(query, function (sqlError, result) {
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'Status updated successfully', ""));
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
    }

    this.frequentlySold = function (req, res, next) {
        try {
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "SELECT o.itemID, count(*), i.itemName FROM item_order o ,item i where o.itemID = i.itemID group by itemID order by count(*) DESC";
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

}

module.exports = new item_order();