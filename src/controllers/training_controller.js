const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const { ObjectId } = require('mongodb');
const genericFunction = require('../helpers/generic_functions');


const insert_task = (req = request, res = response) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = new Date();
        req.body.update_date = new Date();
        req.body.category_id = new ObjectId(req.body.category_id)
        req.body.from = new Date(req.body.from);
        req.body.to = new Date(req.body.to);


        const segmentation = req.body.segmentation;
        const areas = segmentation.areas;
        const branches = segmentation.branches;
        const companies = segmentation.companies;
        const type_collaborators = segmentation.type_collaborators;


        areas.forEach((elemento, indice, areas) => {
            areas[indice] = new ObjectId(elemento);
        });

        branches.forEach((elemento, indice, branches) => {
            branches[indice] = new ObjectId(elemento);
        });

        companies.forEach((elemento, indice, companies) => {
            companies[indice] = new ObjectId(elemento);
        });

        type_collaborators.forEach((elemento, indice, type_collaborators) => {
            type_collaborators[indice] = new ObjectId(elemento);
        });

        console.log(req.body);
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('training.tasks').insertOne(req.body);         

        }).then(async(dataReturnResult) => {

            if (dataReturnResult.acknowledged) {                
                getUsersSegmentation(req, res,areas, branches, companies,type_collaborators,dataReturnResult)
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            }
          
            await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
        });

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        return res.json(dataReturn);
    }
};


const getUsersSegmentation = (req = request, res = response, areas, branches, companies,type_collaborators,dataReturnResultTask) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB

        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
             
             const filtro = {
                $or: [
                    { company_id: { $in: companies } },
                    { area_id: { $in: areas } },
                    { branch_id: { $in: branches } },
                    { type_collaborator_id: { $in: type_collaborators } }
                ]
            };

            return db.collection('hnt.employees').find(filtro).toArray();        

        }).then(async(dataReturnResult) => {

            console.log("USUARIOS encontrados");
            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                insertOnbordingUsers(req, res, dataReturnResult, dataReturnResultTask)           
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "se insertó la tarea, pero no se encontraron usuarios";
                dataReturn.data = dataReturnResultTask
                res.json(dataReturn);
            }
           
            await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
        });

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        return res.json(dataReturn);
    }
};

const insertOnbordingUsers = (req, res, dataUserMatch, dataReturnResultTask) => {
    try {


        console.log("DATOS FINALES PARA INSERT")
        console.log(dataUserMatch);
        console.log(dataReturnResultTask);

        var userInsert = [];
        dataUserMatch.forEach((elemento, indice, dataUserMatch) => {
             userInsert.push({       
                task_id: dataReturnResultTask.insertedId,
                user_id: elemento._id,
                status: "Not Started",
                expiration: new Date(),
                create_date:new Date(),
                update_date: new Date()
        })
        });

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB


        console.log("Datos",userInsert);

        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('training.onbording_users').insertMany(userInsert);         

        }).then(async(dataReturnResult) => {

            if (dataReturnResult.acknowledged) {                
                dataReturn.valid = true;
                dataReturn.type = "succes";
                dataReturn.message = "tarea y usuarios insertados correctamente";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            }
          
            await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
        });

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        return res.json(dataReturn);
    }
};



module.exports = {  
    insert_task, 
};