// Definir el esquema JSON
const schemainsertTask = {
    "type": "object",
    "properties":  
    {
        title: { type: 'string' },
        icon_path: { type: 'string' },
        content: { type: 'string' },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              archive_name: { type: 'string' },
              extension: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['archive_name', 'extension', 'url']
          }
        },
        expiration_amount: { type: 'integer' },
        has_expiration: { type: 'boolean' },
        expiration_sequence: { enum: ['before', 'after'] },
        category_id: { bsonType: 'objectId' },
        send_notification: { type: 'boolean' },
        segmentation_type: { type: 'boolean' },
        segmentation: {
          type: 'object',
          properties: {
            areas: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            branches: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            companies: {
              type: 'array',
              items: { bsonType: 'objectId' }
            },
            type_collaborators: {
              type: 'array',
              items: { bsonType: 'objectId' }
            }
          },
          required: ['areas', 'branches', 'companies', 'type_collaborators']
        },
        create_date: { bsonType: 'date', description: 'debe ser una fecha y es obligatorio' },
        update_date: { bsonType: 'date', description: 'debe ser una fecha y es obligatorio' },
        autoAssign: { type: 'boolean' },
        type_assignment: { enum: ['C','A','R','T',''] },
        from: { bsonType: 'date' },
        to: { bsonType: 'date' },
        priority:  { enum: ['low', 'high'] }
      }
    
    ,
    "required": [ 'title',
    'icon_path',
    'content',
    'attachments',
    'expiration_amount',
    'has_expiration',
    'expiration_sequence',
    'category_id',
    'send_notification',
    'segmentation_type',
    'segmentation',
    'autoAssign',
    'type_assignment',
    'from',
    'to',
    'priority' ]
  };

module.exports = {
    schemainsertTask 
};




 