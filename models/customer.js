function customer() {
    var helper = require('../models/helper');
    var url = require('url');
    var jwt = require('jsonwebtoken');
    var md5 = require('md5');

    
    this.get = function (req, res, next) {
        try {
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    //console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "select * from customer";
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
                    var checkDuplication = "select * from customer where phoneNo ='" + reqObj.phoneNo + "'";
                    // console.log(checkDuplication);
                    conn.query(checkDuplication, function (sqlError, checkDuplicateResult) {
                        if (sqlError) {
                            console.error('Sql error:' + sqlError);
                            return next(sqlError);
                        }
                        if (checkDuplicateResult.length >= 1) {
                            res.send(helper.createResponse(helper.Error, helper.errorStatusCode, 'Mobile Number already exists!', ''));
                        } else {
                            var insertSql = "INSERT INTO customer SET ?";
                            var insertValues = {
                                'phoneNo': reqObj.phoneNo,
                                'password': md5(reqObj.password),
                            };
                            // console.log(insertSql);
                            conn.query(insertSql, insertValues, function (sqlError, result) {
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'User added successfully', result.insertID));
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


    this.userLogin = function (req, res, next) {
        try {
            var url_query = url.parse(req.url, true).query;
            var phoneNo = url_query.phoneNo;
            var password =   md5(url_query.password);
            var user = phoneNo;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                    var query = "select customerID,role from customer where phoneNo='"+phoneNo+"' and password='"+password+"'";
                    console.log(query);
                    conn.query(query, function (sqlError, result) {
                        if (sqlError) {
                            console.error('SQL Error:', sqlError);
                            return next(sqlError);
                        }
                        if (result.length >= 1) {
                            var token = jwt.sign(
                                { 
                                    phoneNo: this.phoneNo,
                                    password: this.password
                                 },
                                'secret',
                                {
                                    expiresIn: '25h'   
                                }
                            );
                            result.push(token);
                            // result.push({user:user});
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


    this.updateRole = function (req, res, next) {
        try {
            var reqObj = req.body;
            req.getConnection(function (connectionError, conn) {
                if (connectionError) {
                    console.error('SQL Connection Error:', connectionError);
                    return next(connectionError);
                } else {
                            var query = "update customer set role = "+reqObj.role+" where phoneNo = "+reqObj.phoneNo+" and role!=2";
                            console.log(query);
                            conn.query(query, function (sqlError, result) {
                                if (sqlError) {
                                    console.error('Sql error:' + sqlError);
                                    return next(sqlError);
                                }
                                if (result.affectedRows >= 1) {
                                    res.send(helper.createResponse(helper.Success, helper.successStatusCode, 'Role updated successfully', ""));
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
    

}

module.exports = new customer();