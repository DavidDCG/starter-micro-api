
require('dotenv').config();

const isValidValue = (value) => {
  return value !== null && value !== undefined && value !== '';
};

module.exports = {
    isValidValue
}