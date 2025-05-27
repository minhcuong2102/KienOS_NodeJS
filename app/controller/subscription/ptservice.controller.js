const express = require('express');
const {
  getAllSubscriptions,
  getAllContracts,
  getAllPtContracts,

  getPtServices, 
  getPtContractFormCompilation,
  getPtContractByCustomerId, 
  addPtContract,
  updatePtContract,
  deletePtContract,

  getAllContractsNonPT_ForFE,
  getAllContractsPT_ForFE,
  
  deletePtContractMultiple
} = require('../../service/subscription/ptservice.service');
const {successResponse} = require('../../util/response.util');

const router = express.Router();


router.get('/', (req, res, next) => {
  return getAllSubscriptions()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getAllSubscriptions', (req, res, next) => {
  return getAllSubscriptions()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getAllPtContracts', (req, res, next) => {
  return getAllPtContracts()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getAllContracts', (req, res, next) => {
  return getAllContracts()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getPtServices', (req, res, next) => {
  return getPtServices()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getPtContractFormCompilation', (req, res, next) => {
  return getPtContractFormCompilation()
    .then(t => {successResponse(res, t)})
    .catch(next);
});

// Example Url: localhost:8001/ptservice/getPtContractByCustomerId/2
router.get('/getPtContractByCustomerId/:id', (req, res, next) => {
  return getPtContractByCustomerId(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.post('/addPtContract', (req, res, next) => {
  return addPtContract(req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.put('/updatePtContract/:id', (req, res, next) => {
  return updatePtContract(req.params.id, req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

// delete route
router.delete('/deletePtContract/:id', (req, res, next) => {
  return deletePtContract(req.params.id)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.post('/deletePtContractMultiple', (req, res, next) => {
  return deletePtContractMultiple(req)
    .then(t => {successResponse(res, t)})
    .catch(next);
});

router.get('/getAllContractsNonPT_ForFE', (req, res, next) => {
  return getAllContractsNonPT_ForFE()
    .then(t => { successResponse(res, t) })
    .catch(next);
});

router.get('/getAllContractsPT_ForFE', (req, res, next) => {
  return getAllContractsPT_ForFE()
    .then(t => { successResponse(res, t) })
    .catch(next);
});

function initPtServiceController(app) {
  const subRoute = process.env.SUB_ROUTE || "";
  app.use(subRoute+"/ptcontract", router);
}

module.exports = initPtServiceController;