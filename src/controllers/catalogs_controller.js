const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const { ObjectId } = require('mongodb');
const genericFunction = require('../helpers/generic_functions');

const get_areas = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_areas').aggregate([
                {
                    $lookup: {
                        from: "hnt_companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "company_data"
                    }
                },
                {               
                    $project: {
                        _id: 1,
                        cvecia: 1,
                        code_area: 1,
                        name: 1,
                        company_data: 1,
                        create_date: 1,
                        update_date: 1
                    }
                }

            ]).toArray();

        }).then((dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
            }
            res.json(dataReturn);
            client.close();
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

const insert_area = (req = request, res = response) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        let data_area  = req.body;
        data_area.create_date = new Date();
        data_area.update_date = new Date();
        data_area.company_id = new ObjectId(data_area.company_id)
        console.log(data_area);
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_areas').insertOne(data_area);         

        }).then(async(dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "El area se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_area = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_areas').deleteOne({ _id: new ObjectId(areaId) });         
        }).then(async(dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const update_area = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 
        
        if(genericFunction.isValidValue(updateData.company_id)){
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = new Date(); 

        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_areas').updateOne({ _id: new ObjectId(areaId) },{$set: updateData});         
        }).then(async(dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const get_branch = (req = request, res = response) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_branches').aggregate([

                {
                    $lookup: {
                        from: "hnt_companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "company_data"
                    }
                },

                {                   
                    $project: {
                        _id: 1,
                        cvecia: 1,
                        company_data: 1,
                        create_date: 1,
                        update_date: 1,
                        code_branch: 1,
                        name: 1
                        
                    }
                }

            ]).toArray();

    
        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
            }
            res.json(dataReturn);
            await client.close();
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

const insert_branch = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = new Date();
        req.body.update_date = new Date();
        req.body.company_id = new ObjectId(req.body.company_id)
        console.log(req.body);
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_branches').insertOne(req.body);         

        }).then(async(dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "la sucursal se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_branch = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_branches').deleteOne({ _id: new ObjectId(areaId) });         
        }).then((dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
            client.close();
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

const update_branch = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 
        
        if(genericFunction.isValidValue(updateData.company_id)){
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = new Date(); 

        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_branches').updateOne({ _id: new ObjectId(areaId) },{$set: updateData});         
        }).then(async(dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const get_companies = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_companies').aggregate([                          
                {
                    $project: {
                         _id: 1,
                        cvecia: 1,
                        company_id: 1,
                        create_date: 1,
                        update_date: 1,
                        code_branch: 1,
                        name: 1
                    }
                }
                
            ]).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
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

const insert_company = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = new Date();
        req.body.update_date = new Date();
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_companies').insertOne(req.body);                     
        }).then(async(dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "la compania se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_company = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_companies').deleteOne({ _id: new ObjectId(areaId) });         
        }).then((dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
            client.close();
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

const update_company = (req = request, res = response) => {
    try {
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 
        
        if(genericFunction.isValidValue(updateData.company_id)){
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = new Date(); 

        connectToDatabase().then((dataReturnDB) => {
             db = dataReturnDB.data.dataBase;
             client = dataReturnDB.data.dataClient;
            return db.collection('hnt_companies').updateOne({ _id: new ObjectId(req.params.id) },{$set: updateData});         
        }).then(async(dataReturnResult) => {
           // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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
    ////////
    get_areas,
    insert_area,
    delete_area,
    update_area,
    //////////
    get_branch,
    insert_branch,
    delete_branch,
    update_branch,
    ///////////
    get_companies,
    insert_company,
    delete_company,
    update_company   
};