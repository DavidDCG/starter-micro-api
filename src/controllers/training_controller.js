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

        }).then(async (dataReturnResult) => {

            if (dataReturnResult.acknowledged) {
                getUsersSegmentation(req, res, areas, branches, companies, type_collaborators, dataReturnResult)
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


const getUsersSegmentation = (req = request, res = response, areas, branches, companies, type_collaborators, dataReturnResultTask) => {
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

        }).then(async (dataReturnResult) => {

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
                create_date: new Date(),
                update_date: new Date()
            })
        });

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB


        console.log("Datos", userInsert);

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('training.onbording_users').insertMany(userInsert);

        }).then(async (dataReturnResult) => {

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


const getTasks = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            let dataReturn = {
                '_id': 1,
                'title': 1,
                'icon_path': 1,
                'content': 1,
                'attachments': 1,
                'expiration_amount': 1,
                'has_expiration': 1,
                'expiration_sequence': 1,
                'category_id': 1,
                'send_notification': 1,
                'segmentation_type': 1,
                'segmentation': 1,
                'autoAssign': 1,
                'type_assignment': 1,
                'from': 1,
                'to': 1,
                'priority': 1,
                'create_date': 1,
                'update_date': 1
            }


            let pipeline = [];

            const taskId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(taskId)) {
                pipeline.push({ $match: { '_id': new ObjectId(taskId) } });
            }

            // Agregar la etapa $project para proyectar los campos deseados
            pipeline.push({ $project: dataReturn });

            console.log(pipeline)

            return db.collection('training.tasks').aggregate(pipeline).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
            }
            res.json(dataReturn);
            await client.close()
        }).catch(async (err) => {
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

const onbording_users = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient; 
                  

            let dataReturn_onbording = [
                // Unir la colección onbording_users con la colección tasks usando $lookup
                {
                    $lookup: {
                        from: 'training.tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'task'
                    }
                },    
                { $unwind: '$task' },     
                // Unir la colección task con la colección employees usando $lookup
                {
                    $lookup: {
                        from: 'hnt.employees',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                // Proyectar los campos requeridos
                {
                    $project: {
                        _id: 1,
                        task_id: '$task_id',
                        title: '$task.title',
                        status: 1,
                        priorty: '$task.priority',
                        content: '$task.content',
                        create_date: '$task.create_date',
                        name_employee: '$employee.name',
                        category_id: '$task.category_id'
                    }
                },           
            ]

            

   
            const taskId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(taskId)) {
                dataReturn_onbording.push({ $match: { 'category_id': new ObjectId(taskId) } });
            }           
            return db.collection('training.onbording_users').aggregate(dataReturn_onbording).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
            }
            res.json(dataReturn);
            await client.close()
        }).catch(async (err) => {
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


const categories_onbording = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient; 
                  

            let dataReturn_onbording = [
                // Unir la colección onbording_users con la colección tasks usando $lookup
                {
                    $lookup: {
                        from: 'training.tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'task'
                    }
                },    
                { $unwind: '$task' },     
                // Unir la colección task con la colección employees usando $lookup
                {
                    $lookup: {
                        from: 'hnt.employees',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                // Proyectar los campos requeridos
                {
                    $project: {
                        _id: 1,
                        task_id: '$task_id',
                        status: 1,
                        priorty: '$task.priority',
                        content: '$task.content',
                        create_date: '$task.create_date',
                        name_employee: '$employee.name',
                        user_id: 1,
                        category_id: '$task.category_id'
                    }
                },           
            ]
            const user_id = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(user_id)) {
                dataReturn_onbording.push({ $match: { 'user_id': new ObjectId(user_id) } });
            }           
            return db.collection('training.onbording_users').aggregate(dataReturn_onbording).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {              
            // Suponiendo que tienes dataReturnResult ya definido
            // Utilizamos un conjunto para garantizar valores únicos
            const uniqueCategoryIds = new Set(dataReturnResult.map(task => task.category_id.toString()));
            // Convertimos el conjunto de nuevo en un array
            const uniqueCategoryIdsArray = [...uniqueCategoryIds].map(id => new ObjectId(id));
            get_categories_onbording_distinct(req, res, uniqueCategoryIdsArray)
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
                res.json(dataReturn);

            }         
            await client.close()
        }).catch(async (err) => {
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



const get_categories_onbording_distinct = (req, res, data_categories) => {
    var db;
    var client;
 connectToDatabase().then((dataReturnDB) => {
     switch (dataReturnDB.valid) {
         case true:
              db = dataReturnDB.data.dataBase;
              client = dataReturnDB.data.dataClient;                           
             return db.collection('hnt.categories').aggregate([                          
                {
                    $match: {
                        _id: { $in: data_categories }
                    }
                },
                {
                    $project: {
                        'name': 1,
                        'description': 1,
                        'img_path': 1,
                        'active': 1,
                        'route_icon': 1,
                        'create_date': 1,
                        'update_date': 1
                    }
                }
                
            ]).toArray();                 
         case false:
             res.json(dataReturnDB);
             break;
     }
 }).then(async (dataReturnResult) => {
    if (dataReturnResult.length > 0) {
        dataReturn.valid = true;
        dataReturn.type = "success";
        dataReturn.message = "consulta correcta";
        dataReturn.data = dataReturnResult
    } else {
        dataReturn.valid = true;
        dataReturn.type = "success";
        dataReturn.message = "sin registros encontrados";
        dataReturn.data = dataReturnResult;
    }
    res.json(dataReturn);
    await client.close();

 }).catch((err) => {
     dataReturn.valid = false;
     dataReturn.type = "error";
     dataReturn.message =  err.message;
     dataReturn.data = err;
     res.status(400).json(dataReturn);
 });    
   

 





}



const categories_task = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient; 
                
            let dataReturn = {
                "category_id": "$_id",
                'title': 1,
                'icon_path': 1,
                'content': 1,
                'attachments': 1,
                'expiration_amount': 1,
                'has_expiration': 1,
                'expiration_sequence': 1,
                'category_id': 1,
                'send_notification': 1,
                'segmentation_type': 1,
                'segmentation': 1,
                'autoAssign': 1,
                'type_assignment': 1,
                'from': 1,
                'to': 1,
                'priority': 1,
                'create_date': 1,
                'update_date': 1
            }


            let pipeline = [];
            // Agregar la etapa $project para proyectar los campos deseados
            pipeline.push({ $project: dataReturn });

            console.log(pipeline)

            return db.collection('training.tasks').aggregate(pipeline).toArray();
        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {              
            // Suponiendo que tienes dataReturnResult ya definido
            // Utilizamos un conjunto para garantizar valores únicos
            const uniqueCategoryIds = new Set(dataReturnResult.map(task => task.category_id.toString()));
            // Convertimos el conjunto de nuevo en un array
            const uniqueCategoryIdsArray = [...uniqueCategoryIds].map(id => new ObjectId(id));
            get_categories_onbording_distinct(req, res, uniqueCategoryIdsArray)
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
                res.json(dataReturn);

            }         
            await client.close()
        }).catch(async (err) => {
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
    getTasks,
    onbording_users,
    categories_onbording
};