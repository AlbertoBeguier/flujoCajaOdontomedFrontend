const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ItemListaMaestra = sequelize.define(
  "ItemListaMaestra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listaAsociadaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ["listaId"], // Índice para búsquedas rápidas por listaId
      },
      {
        fields: ["listaAsociadaId"], // Índice para búsquedas por lista asociada
      },
    ],
  }
);

module.exports = ItemListaMaestra;
