const db = require('../../db/models');

async function getAllSubscriptions() {
    const PtService = await db.PtService.findAll();
    const NonPtService = await db.NonPtService.findAll();

    return {PtService, NonPtService};
}

//a function to get all contracts
async function getAllContracts() {
    return await db.Contract.findAll();
}

//a function to get all contracts that has ptservice_id not null
async function getAllPtContracts() {
    return await db.Contract.findAll({
        where: {
            ptservice_id: {
                [db.Sequelize.Op.ne]: null
            }
        },
        include: [
            {
                model: db.PtService,
                as: 'ptService' // Alias for the association
            },
            {
                model: db.CustomerProfile,
                as: 'customer', // Alias for the association
                foreignKey: 'customer_id',
                include: [
                    {
                        model: db.User,
                        as: 'customer', // Alias for the association
                    }
                ]
            }
        ]
    });
}

async function getPtServices() {
    return await db.PtService.findAll();
}

async function getPtContractFormCompilation() {
    const ptServices = await db.PtService.findAll();
    const coachProfiles = await db.CoachProfile.findAll();

    return {ptServices, coachProfiles};
}

async function getPtContractByCustomerId(customerId) {
    if (!customerId) throw new Error('customerId query is required');
    return await db.Contract.findAll({
        where: {
            customer_id: customerId,
            ptservice_id: {
                [db.Sequelize.Op.ne]: null // Ensure ptservice_id is not null
            }
        },
        include: [
            {
                model: db.PtService,
                as: 'ptService' // Alias for the association
            },
            {
                model: db.CoachProfile,
                as: 'coach', // Alias for the association
                foreignKey: 'coach_id'
            }
        ]
    });
}

async function addPtContract(req) {
    console.log(req.body);
    console.log("=====================================");
    let { ptServiceId, coachId, customerId, startDate, expireDate, isPurchased, numberOfSession } = req.body;

    if (!ptServiceId || !customerId) throw new Error('ptServiceId, coachId, customerId is required');
    if (!startDate) startDate = new Date();
    if (!isPurchased) isPurchased = false;
    if (!numberOfSession) numberOfSession = 0;

    const PtService = await db.PtService.findOne({
        where: {
            id: ptServiceId
        }
    });

    const validityPeriod = PtService ? PtService.validity_period : 0;
    if (!expireDate) {
        expireDate = new Date(startDate);
        expireDate.setDate(expireDate.getDate() + validityPeriod);
    }

    const createdContract = await db.Contract.create({
        ptservice_id: ptServiceId,
        coach_id: coachId ? coachId : null,
        customer_id: customerId,
        start_date: startDate,
        expire_date: expireDate,
        used_sessions: 0,
        number_of_session: numberOfSession,
        is_purchased: isPurchased
    });

    return await db.Contract.findOne({
        where: {
            id: createdContract.id
        },
        include: [
            {
                model: db.PtService,
                as: 'ptService' // Alias for the association
            },
            {
                model: db.CoachProfile,
                as: 'coach', // Alias for the association
                foreignKey: 'coach_id'
            },
            {
                model: db.CustomerProfile,
                as: 'customer', // Alias for the association
                foreignKey: 'customer_id',
                include: [
                    {
                        model: db.User,
                        as: 'customer', // Alias for the association in CustomerProfile
                        foreignKey: 'customer_id',
                        attributes: { exclude: ['password'] } // Exclude the password field
                    },
                    {
                        model: db.WorkoutGoal,
                        as: 'workout_goal', // Alias for the association in CustomerProfile
                        foreignKey: 'workout_goal_id'
                    }
                ]
            }
        ]
    });
}

async function updatePtContract(contractId, req) {
    console.log(req.body);
    console.log("=====================================");
    const {coachId, startDate, expireDate, usedSession, isPurchased, numberOfSession} = req.body;

    const updateData = {};

    if (coachId !== undefined) updateData.coach_id = coachId;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (expireDate !== undefined) updateData.expire_date = expireDate;
    if (usedSession !== undefined && !isNaN(Number(usedSession))) updateData.used_sessions = Number(usedSession);
    if (isPurchased !== undefined) updateData.is_purchased = isPurchased;
    if (numberOfSession !== undefined) updateData.number_of_session = numberOfSession;

    return await db.Contract.update(updateData, {
        where: {
            id: contractId
        }
    });
}

async function deletePtContractMultiple(req) {
    const {ids} = req.body;
    
    return await db.Contract.destroy({
        where: {
            id: {
                [db.Sequelize.Op.in]: ids
            }
        }
    });
}

async function deletePtContract(contractId) {
    return await db.Contract.destroy({
        where: {
            id: contractId
        }
    });
}

//for sale FE page
// make a function to return all contracts that nonptservice_id is not null, then include NonPtService using nonptservice_id , CoachProfile using coach_id, CustomerProfile using customer_id
async function getAllContractsNonPT_ForFE(){
    return await db.Contract.findAll({
        where: {
            nonptservice_id: {
                [db.Sequelize.Op.ne]: null
            }
        },
        include: [
            {
                model: db.NonPtService,
                as: 'nonPtService' // Alias for the association
            },
            {
                model: db.CoachProfile,
                as: 'coach', // Alias for the association
                foreignKey: 'coach_id'
            },
            {
                model: db.CustomerProfile,
                as: 'customer', // Alias for the association
                foreignKey: 'customer_id'
            }
        ]
    });
}

async function getAllContractsPT_ForFE() {
    return await db.Contract.findAll({
        where: {
            ptservice_id: {
                [db.Sequelize.Op.ne]: null
            }
        },
        include: [
            {
                model: db.PtService,
                as: 'ptService' // Alias for the association
            },
            {
                model: db.CoachProfile,
                as: 'coach', // Alias for the association
                foreignKey: 'coach_id'
            },
            {
                model: db.CustomerProfile,
                as: 'customer', // Alias for the association
                foreignKey: 'customer_id',
                include: [
                    {
                        model: db.User,
                        as: 'customer', // Alias for the association in CustomerProfile
                        foreignKey: 'customer_id',
                        attributes: { exclude: ['password'] } // Exclude the password field
                    }
                ]
            }
        ]
    });
}

module.exports = {
    getAllSubscriptions,
    getAllContracts,

    getAllPtContracts,
    getPtServices,
    getPtContractFormCompilation,
    
    addPtContract,
    getPtContractByCustomerId,
    updatePtContract,
    deletePtContract,

    getAllContractsNonPT_ForFE,
    getAllContractsPT_ForFE,
    deletePtContractMultiple
}