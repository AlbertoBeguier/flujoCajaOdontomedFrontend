const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ItemListaMaestra = require("./ItemListaMaestra");

const ListaMaestra = sequelize.define("ListaMaestra", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Definir relaciones
ListaMaestra.hasMany(ItemListaMaestra, {
  as: "items",
  foreignKey: "listaId",
});

ItemListaMaestra.belongsTo(ListaMaestra, {
  as: "lista",
  foreignKey: "listaId",
});

module.exports = ListaMaestra;
