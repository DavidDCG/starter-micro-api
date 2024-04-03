const { dataReturn } = require('../helpers/constants');
const genericFunction = require('../helpers/generic_functions');
const { Validator } = require('jsonschema');
const validator = new Validator();
const { connectToDatabase } = require('../../config/db');
const { ObjectId } = require('mongodb');
const schemaData = require('../schema/catalogs_schema');

// Definir el esquema JSON
const schemaInsertArea = schemaData.schemaInsertArea;
const schemaUpdateArea = schemaData.schemaUpdateArea;

const schemaInsertBranch = schemaData.schemaInsertBranch;
const schemaUpdateBranch = schemaData.schemaUpdateBranch;

const schemaInsertCompany = schemaData.schemaInsertCompany;
const schemaUpdateCompany = schemaData.schemaUpdateCompany;

// Método para validar el cuerpo de la solicitud
insert_area = (req, res, next) => {
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaInsertArea);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de insert no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "catalogs"
        res.status(400).json(dataReturn);
    } else{

        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                    return Promise.all([
                        db.collection('hnt_areas').find( { code_area: requestBody.code_area }).toArray(),
                        db.collection('hnt_companies').find( { _id: new ObjectId(requestBody.company_id) }).toArray()
                      ]);
                   
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then((dataReturnResult) => {
            const exists_code_area = dataReturnResult[0].filter(item => item.code_area == requestBody.code_area).length;
            const exists_company_id = dataReturnResult[1].filter(item => item._id == requestBody.company_id).length;
            if (exists_code_area > 0) {
                throw new Error('el codigo de area '+requestBody.code_area+' ya existe, favor de intentar con otro codigo no existente.');
            } 
            else if (exists_company_id == 0) {
                throw new Error('el id_company '+requestBody.company_id+' no existe, favor de intentar con otro valor.');           
            }
            else {
                next();
            }
            client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });

    }
 
}

// Método para validar el cuerpo de la solicitud
update_area = (req, res, next) => {
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaUpdateArea);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de update no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "catalogs"
        res.status(400).json(dataReturn);
    } else {
        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                    return Promise.all([
                        db.collection('hnt_areas').find( { code_area: requestBody.code_area }).toArray(),
                        db.collection('hnt_companies').find( { _id: new ObjectId(requestBody.company_id) }).toArray()
                      ]);
                   
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then( (dataReturnResult) => {
    
            if(genericFunction.isValidValue(requestBody.code_area)){
    
                const exists_code_area = dataReturnResult[0].filter(item => item.code_area == requestBody.code_area).length;              
                if (exists_code_area > 0) {
                    throw new Error('el codigo de area '+requestBody.code_area+' ya existe, favor de intentar con otro codigo no existente.');
                } 
    
            }
    
            if(genericFunction.isValidValue(requestBody.company_id)){
    
                const exists_company_id = dataReturnResult[1].filter(item => item._id == requestBody.company_id).length;
           
                if (exists_company_id == 0) {
                   throw new Error('el id_company '+requestBody.company_id+' no existe, favor de intentar con otro valor.');           
               }
    
            }
                         
            next();
        
            client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });

    }

  
}

validate_area_exists = (req, res, next) => {
    var db;
    var client;
    const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
    console.log(areaId);
    connectToDatabase().then((dataReturnDB) => {
        switch (dataReturnDB.valid) {
            case true:
                 db = dataReturnDB.data.dataBase;
                 client = dataReturnDB.data.dataClient;
                return Promise.all([
                    db.collection('hnt_areas').find( { _id: new ObjectId(areaId) }).toArray(),
                  ]);
               
            case false:
                res.json(dataReturnDB);
                break;
        }
    }).then( async (dataReturnResult) => {
        const exists_code_area = dataReturnResult[0].filter(item => item._id == areaId).length;     
        if (exists_code_area == 0) {
            throw new Error('el codigo de area '+ areaId +' no existe, favor de intentar con otro código.');
        }        
        else {
            next();
        }
       await client.close();
    }).catch((err) => {
        dataReturn.valid = false;
        dataReturn.type = "error";
        dataReturn.message =  err.message;
        dataReturn.data = err;
        res.status(400).json(dataReturn);
    });
}

// Método para validar el cuerpo de la solicitud
insert_branch = (req, res, next) => {
    
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaInsertBranch);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de insert no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "catalogs"
        res.status(400).json(dataReturn);
    }
    else{

        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                    return Promise.all([
                        db.collection('hnt_branches').find( { code_branch: requestBody.code_branch }).toArray(),
                        db.collection('hnt_companies').find( { _id: new ObjectId(requestBody.company_id) }).toArray()
                      ]);
                   
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then( (dataReturnResult) => {
            const exists_code_branch = dataReturnResult[0].filter(item => item.code_branch == requestBody.code_branch).length;
            const exists_company_id = dataReturnResult[1].filter(item => item._id == requestBody.company_id).length;
            if (exists_code_branch > 0) {
                throw new Error('el codigo de sucursal '+requestBody.code_branch+' ya existe, favor de intentar con otro codigo no existente.');
            } 
            else if (exists_company_id == 0) {
                throw new Error('el id_company '+requestBody.company_id+' no existe, favor de intentar con otro valor.');           
            }
    
            else {
                next();
            }
         client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });
    }
   
}

validate_branch_exists = (req, res, next) => {
    var db;
    var client;
    console.log(req.params.id);
    connectToDatabase().then((dataReturnDB) => {
        switch (dataReturnDB.valid) {
            case true:
                 db = dataReturnDB.data.dataBase;
                 client = dataReturnDB.data.dataClient;
                return Promise.all([
                    db.collection('hnt_branches').find( { _id: new ObjectId(req.params.id) }).toArray(),
                  ]);               
            case false:
                res.json(dataReturnDB);
                break;
        }
    }).then( async (dataReturnResult) => {
        const exists_code_area = dataReturnResult[0].filter(item => item._id == req.params.id).length;     
        if (exists_code_area == 0) {
            throw new Error('el codigo de sucursal '+ req.params.id +' no existe, favor de intentar con otro código.');
        }        
        else {
            next();
        }
       await client.close();
    }).catch((err) => {
        dataReturn.valid = false;
        dataReturn.type = "error";
        dataReturn.message =  err.message;
        dataReturn.data = err;
        res.status(400).json(dataReturn);
    });
}

// Método para validar el cuerpo de la solicitud
update_branch = (req, res, next) => {
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaUpdateBranch);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de update no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "catalogs"
        res.status(400).json(dataReturn);
    } else {
        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                    return Promise.all([
                        db.collection('hnt_branches').find( { code_branch: requestBody.code_branch }).toArray(),
                        db.collection('hnt_companies').find( { _id: new ObjectId(requestBody.company_id) }).toArray()
                      ]);
                   
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then( async (dataReturnResult) => {    
            if(genericFunction.isValidValue(requestBody.code_branch)){    
                const exists_code_branch = dataReturnResult[0].filter(item => item.code_branch == requestBody.code_branch).length;              
                if (exists_code_branch > 0) {
                    throw new Error('el codigo de sucursal '+requestBody.code_branch+' ya existe, favor de intentar con otro codigo no existente.');
                }     
            }
            if(genericFunction.isValidValue(requestBody.company_id)){
                const exists_company_id = dataReturnResult[1].filter(item => item._id == requestBody.company_id).length;         
                if (exists_company_id == 0) {
                   throw new Error('el id_company '+requestBody.company_id+' no existe, favor de intentar con otro valor.');           
               }    
            }                     
            next();
           await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });

    }

  
}


// Método para validar el cuerpo de la solicitud
insert_company = (req, res, next) => {
    var db;
    var client;
    const requestBody = req.body;
    const validationResult = validator.validate(requestBody, schemaInsertCompany);
    const errors = validationResult.errors.map(error => error.stack);
    if (!validationResult.valid) {
        dataReturn.message = "formato de insert no válido";
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "catalogs"
        res.status(400).json(dataReturn);
    }
    else{

        connectToDatabase().then((dataReturnDB) => {
            switch (dataReturnDB.valid) {
                case true:
                     db = dataReturnDB.data.dataBase;
                     client = dataReturnDB.data.dataClient;
                    return Promise.all([
                        db.collection('hnt_companies').find( { cvecia: requestBody.cvecia }).toArray(),
                      ]);
                   
                case false:
                    res.json(dataReturnDB);
                    break;
            }
        }).then( async (dataReturnResult) => {
            const exists_code_branch = dataReturnResult[0].filter(item => item.cvecia == requestBody.cvecia).length;
            if (exists_code_branch > 0) {
                throw new Error(`el codigo de empresa ${requestBody.cvecia} ya existe, favor de intentar con otro codigo no existente.`);
            }                
            else {
                next();
            }
         await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message =  err.message;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });
    }
   
}

validate_company_exists = (req, res, next) => {
    var db;
    var client;
    connectToDatabase().then((dataReturnDB) => {
        switch (dataReturnDB.valid) {
            case true:
                 db = dataReturnDB.data.dataBase;
                 client = dataReturnDB.data.dataClient;
                return Promise.all([
                    db.collection('hnt_companies').find( { _id: new ObjectId(req.params.id) }).toArray(),
                  ]);               
            case false:
                res.json(dataReturnDB);
                break;
        }
    }).then( async (dataReturnResult) => {
        const exists_code_area = dataReturnResult[0].filter(item => item._id == req.params.id).length;     
        if (exists_code_area == 0) {
            throw new Error('el codigo '+ req.params.id +' no existe, favor de intentar con otro código.');
        }        
        else {
            next();
        }
       await client.close();
    }).catch((err) => {
        dataReturn.valid = false;
        dataReturn.type = "error";
        dataReturn.message =  err.message;
        dataReturn.data = err;
        res.status(400).json(dataReturn);
    });
}

module.exports = {
    insert_area,
    update_area,
    validate_area_exists,
    insert_branch,
    validate_branch_exists,
    update_branch,
    insert_company,
    validate_company_exists   
};