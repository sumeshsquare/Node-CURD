module.exports = function(sequelize, Sequalize) {
    var FlowSchema = sequelize.define("Flow", {
        flow: Sequalize.STRING,
        files: Sequalize.STRING,
        createdAt: Sequalize.STRING,
        updatedAt: Sequalize.STRING
    },{
        timestamps: false
    });
    return FlowSchema;
}