// Definir el esquema JSON
const schemaInsertArea = {
    "type": "object",
    "properties": {
        "code_area": { "type": "string" },
        "description_area": { "type": "string" },
        "company_id": { "type": "string" }
    },
    "required": ["code_area", "description_area", "company_id"]
};

const schemaUpdateArea = {
    "type": "object",
    "properties": {
        "code_area": { "type": "string" },
        "description_area": { "type": "string" },
        "company_id": { "type": "string" }
    }
};

// Definir el esquema JSON
const schemaInsertBranch = {
    "type": "object",
    "properties": {
        "code_branch": { "type": "string" },
        "name_branch": { "type": "string" },
        "company_id": { "type": "string" }
    },
    "required": ["code_branch", "name_branch", "company_id"]
};

// Definir el esquema JSON
const schemaUpdateBranch = {
    "type": "object",
    "properties": {
        "code_branch": { "type": "string" },
        "name_branch": { "type": "string" },
        "company_id": { "type": "string" }
    }
};


// Definir el esquema JSON
const schemaInsertCompany = {
    "type": "object",
    "properties": {
        "cvecia": { "type": "string" },
        "name_company": { "type": "string" }
    },
    "required": ["cvecia", "name_company"]
};

// Definir el esquema JSON
const schemaUpdateCompany = {
    "type": "object",
    "properties": {
        "cvecia": { "type": "string" },
        "name_company": { "type": "string" }
    }
};


// Definir el esquema JSON
const schemaCategory = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "active": { "type": "boolean" },
        "route_icon": { "type": "string" }
    },
    "required": ["name", "description","active","route_icon"]
};



module.exports = {
    schemaInsertArea,
    schemaUpdateArea,
    schemaInsertBranch,
    schemaUpdateBranch,
    schemaInsertCompany, 
    schemaUpdateCompany,
    schemaCategory   
};