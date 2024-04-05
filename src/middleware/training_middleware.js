const { dataReturn } = require('../helpers/constants');
const genericFunction = require('../helpers/generic_functions');
const { Validator } = require('jsonschema');
const validator = new Validator();
const { connectToDatabase } = require('../../config/db');
const { ObjectId } = require('mongodb');
const schemaData = require('../schema/training_schema');

const schemaTask = schemaData.schemainsertTask;

// Método para validar el cuerpo de la solicitud

validate_task = (req, res, next) => {
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaTask);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de insert no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "task"
        res.status(400).json(dataReturn);
    }
    else {

           // Accediendo a los atributos de segmentation
           const segmentation = requestBody.segmentation;
           const areas = segmentation.areas;
           const branches = segmentation.branches;
           const companies = segmentation.companies;
           const type_collaborators = segmentation.type_collaborators;
           

        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                     let promise = []
                   
                        for (const area of areas) {
                            const result = db.collection('hnt.areas').find( { _id: new ObjectId(area) }).toArray()
                            promise.push(result);
                        }
                        for (const branch of branches) {
                            const result = db.collection('hnt.branches').find( { _id: new ObjectId(branch) }).toArray()
                            promise.push(result);
                        }

                        for (const company of companies) {
                            const result = db.collection('hnt.companies').find( { _id: new ObjectId(company) }).toArray()
                            promise.push(result);
                        }

                        for (const type_collaborator of type_collaborators) {
                            const result = db.collection('hnt.type_collaborators').find( { _id: new ObjectId(type_collaborator) }).toArray()
                            promise.push(result);
                        }
                        // const branches = segmentation.branches;
                        // const companies = segmentation.companies;                          
                        console.log(promise);
                        
                    return Promise.all(promise);                  
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then(async (dataReturnResult) => {

            for (let i = 0; i < dataReturnResult.length; i++) {
                if(dataReturnResult[i].length == 0){
                    throw new Error('No todos los datos de segmentación existen en la base de datos favor de validar. posicion['+i+']');
                } 
               // console.log("Elemento:", miArray[i], "Posición:", i);
            }
            client.close();
            next();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });    
    }
 





}

module.exports = {
    validate_task
};

