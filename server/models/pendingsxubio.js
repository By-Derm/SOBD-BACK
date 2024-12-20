import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../mysql.config.js";

const Pendingsxubio = sequelize.define('PendingsXubio', {
    remito: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'pendingsxubio',
    timestamps: false, // Desactiva createdAt y updatedAt, si no necesitas esos campos
});

export default Pendingsxubio;