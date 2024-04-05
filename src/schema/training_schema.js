// Definir el esquema JSON
const schemainsertTask = {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "content": { "type": "string" },
      "expiration_amount": { "type": "integer" },
      "has_expiration": { "type": "boolean" },
      "expiration_time": { "type": "string", "format": "date-time" },
      "expiration_sequence": { "type": "string" },
      "category_id": { "type": "string" },
      "send_notification": { "type": "boolean" },
      "segmentation_type": { "type": "string" },
      "from": { "type": "string", "format": "date-time" },
      "to": { "type": "string", "format": "date-time" },
      "attachments": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "archive_name": { "type": "string" },
            "extension": { "type": "string" },
            "url": { "type": "string" }
          },
          "required": ["archive_name", "extension", "url"]
        }
      },
      "icon_path": { "type": "string", "format": "uri" },
      "segmentation": {
        "type": "object",
        "properties": {
          "areas": {
            "type": "array",
            "items": { "type": "string" }
          },
          "branches": {
            "type": "array",
            "items": { "type": "string" }
          },
          "companies": {
            "type": "array",
            "items": { "type": "string" }
          },
          "type_collaborators": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["areas", "branches", "companies","type_collaborators"]
      }
    },
    "required": ["title", "content", "expiration_amount", "has_expiration", "expiration_time", "expiration_sequence", "category_id", "send_notification", "segmentation_type", "from", "to", "attachments", "icon_path", "segmentation"]
  };

module.exports = {
    schemainsertTask 
};