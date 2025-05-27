const db = require('../../db/models');

async function getNonPtServices() {
    return await db.NonPtService.findAll();
}

async function getAllNonPtContracts(){
    return await db.Contract.findAll({
        where: {
            nonptservice_id: {
                [db.Sequelize.Op.ne]: null
            }
        }
    });
}

async function getNonPtContractByCustomerId(customerId) {
    if(!customerId) throw new Error('customerId query is required');
    return await db.Contract.findAll({
        where: {
            customer_id: customerId,
            nonptservice_id: {
                [db.Sequelize.Op.ne]: null // Ensure nonptservice_id is not null
            }
        },
        include: [{
            model: db.NonPtService,
            as: 'nonPtService' // Alias for the association
        }]
    });
}

async function getNonPtContractFormCompilation() {
    const nonPtServices = await db.NonPtService.findAll();

    return {nonPtServices};
}


async function addNonPtContract(req) {
    let { nonPtServiceId, customerId, startDate, expiredDate, duration } = req.body;

    if (!nonPtServiceId || !customerId || !duration) throw new Error('nonPtServiceId, customerId, duration is required');

    // Ensure startDate is a valid Date object
    if (!startDate) {
        startDate = new Date();
    } else {
        startDate = new Date(startDate);
    }

    // Ensure expiredDate is a valid Date object
    if (!expiredDate) {
        expiredDate = new Date(startDate);
        expiredDate.setMonth(expiredDate.getMonth() + duration);
    } else {
        expiredDate = new Date(expiredDate);
    }

    return await db.Contract.create({
        nonptservice_id: nonPtServiceId,
        customer_id: customerId,
        start_date: startDate,
        expire_date: expiredDate,
        used_sessions: 0,
        is_purchased: false
    });
}

async function updateNonPtContract(contractId, req) {
    const {startDate, expireDate, isPurchased } = req.body;
    console.log(req.body)

    const updateData = {};

    if (startDate !== undefined) updateData.start_date = startDate;
    if (expireDate !== undefined) updateData.expire_date = expireDate;
    if (isPurchased !== undefined) updateData.is_purchased = isPurchased;

    return await db.Contract.update(updateData, {
        where: {
            id: contractId
        }
    });
}

async function deleteNonPtContract(contractId) {
    return await db.Contract.destroy({
        where: {
            id: contractId
        }
    });
}

async function deleteNonPtContractMultiple(req) {
    const {ids} = req.body;

    return await db.Contract.destroy({
        where: {
            id: {
                [db.Sequelize.Op.in]: ids
            }
        }
    });
}

module.exports = {
    
    getAllNonPtContracts,
    getNonPtServices,
    getNonPtContractFormCompilation,

    addNonPtContract,
    getNonPtContractByCustomerId,
    updateNonPtContract,
    deleteNonPtContract,

    deleteNonPtContractMultiple

}