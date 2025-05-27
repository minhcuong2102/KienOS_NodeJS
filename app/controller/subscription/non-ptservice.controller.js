const express = require('express');
const {
  getAllSubscriptions
} = require('../../service/subscription/ptservice.service');

const {
  getNonPtServices, 
  getNonPtContractByCustomerId, 
  getAllNonPtContracts,
  
  addNonPtContract,
  updateNonPtContract,
  deleteNonPtContract,

  deleteNonPtContractMultiple
} = require('../../service/subscription/non-ptservice.service');

const {successResponse} = require('../../util/response.util');

const router = express.Router();


router.get('/', (req, res, next) => {
  return getAllSubscriptions()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getNonPtServices', (req, res, next) => {
  return getNonPtServices()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getAllNonPtContracts', (req, res, next) => {
  return getAllNonPtContracts()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getNonPtContractByCustomerId/:id', (req, res, next) => {
  return getNonPtContractByCustomerId(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.post('/addNonPtContract', (req, res, next) => {
  return addNonPtContract(req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.put('/updateNonPtContract/:id', (req, res, next) => {
  return updateNonPtContract(req.params.id, req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

//make route for delete non-pt contract
router.delete('/deleteNonPtContract/:id', (req, res, next) => {
  return deleteNonPtContract(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.post('/deleteNonPtContractMultiple', (req, res, next) => {
  return deleteNonPtContractMultiple(req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

function initNonPtServiceController(app) {
  const subRoute = process.env.SUB_ROUTE || "";
  app.use(subRoute+"/non-ptcontract", router);
}

module.exports = initNonPtServiceController;