
const WorkoutGoal = require('./workout-goal');

const initAllWorkoutModel = (sequelize) => ({
    WorkoutGoal: WorkoutGoal.init(sequelize),    
});

module.exports = {
    initAllWorkoutModel
};