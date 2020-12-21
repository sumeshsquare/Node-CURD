var express = require('express');
var Flow = require('../models').Flow;
var router = express.Router();
var dateFormat = require('dateformat');
// middleware
// var checkIDInput = function (req, res, next) {  
//     //console.log('Check ID input');
//     if(isNaN(req.params.flow)) {
//         //console.log('Invalid ID supplied');
//         res.status(400).json('Invalid ID supplied');
//     } else {
//         next();
//     }
// };
var checkFlowExist = function (req, res, next) {  
    //console.log('Check ID exist');
    Flow.count({ where: { flow: req.params.flow } }).then(count => {
        if (count != 0) {
            next();
        } else {
            //console.log('Flow not found');
            res.status(400).json('Flow not found');
        }
    }); 
};

var checkIDExist = function (req, res, next) {  
    //console.log('Check ID exist');
    Flow.count({ where: { id: req.params.id } }).then(count => {
        if (count != 0) {
            next();
        } else {
            //console.log('Book not found');
            res.status(400).json('Flow not found');
        }
    }); 
};

var checkFlowInput = function (req, res, next) {  
    //console.log('Check ID input');
    if(!req.body.flow == true || !req.body.files == true)  {
        //console.log('Invalid ID supplied');
        res.status(400).json('Invalid input request supplied');
    } else {
        next();
    }
};

router.get('/', function(req, res){
    //console.log('Getting all flow');
    Flow.findAll().then(flow => {
        res.status(200).json(flow);
    });
});

router.post('/', [checkFlowInput], function(req, res){
    Flow.create({
        flow: req.body.flow,
        files: req.body.files,
        createdAt: dateFormat(new Date(), "ddd mmm dd yyyy HH:MM:ss" ),
        updatedAt: ""

    }).then(flow => {
        /*console.log(flow.get({
            plain: true
        }));*/
        res.status(200).json(flow);
    }).error(err => {
        res.status(405).json('Error has occured');
    });
});

router.get('/:flow', [ checkFlowExist], function(req, res){
    //console.log('Get flow by id');
    Flow.findOne({ where: { flow: req.params.flow } }).then(flow => {
        //console.log(flow);
        res.status(200).json(flow);
    });
});

router.put('/:flow', [ checkFlowExist], function(req, res){
    //console.log('Update flow by id');
    Flow.update({
        flow: req.body.flow,
        files: req.body.files,
        updatedAt: dateFormat(new Date(), "ddd mmm dd yyyy HH:MM:ss" )
    },{
        where: { flow: req.params.flow }
    }).then(result => {
        res.status(200).json(result);
    });
});

router.delete('/:flow', [ checkFlowExist], function(req, res){
    //console.log('Delete flow by id');
    Flow.destroy({
        where: { flow: req.params.flow }
    }).then(result => {
        res.status(200).json(result);
    });
});

module.exports = router;