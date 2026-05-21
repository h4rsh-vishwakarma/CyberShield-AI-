// MongoDB initialization script
// This script runs automatically when MongoDB container starts

// Create application database
db = db.getSiblingDB('cybershield');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password_hash', 'created_at'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^.+@.+\..+$'
        },
        password_hash: {
          bsonType: 'string'
        },
        name: {
          bsonType: 'string'
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin']
        },
        created_at: {
          bsonType: 'date'
        },
        updated_at: {
          bsonType: 'date'
        },
        two_factor: {
          bsonType: 'object',
          properties: {
            enabled: { bsonType: 'bool' },
            method: { bsonType: 'string' },
            secret: { bsonType: 'string' }
          }
        }
      }
    }
  }
});

// Create alerts collection
db.createCollection('alerts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'type', 'severity', 'created_at'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        type: {
          bsonType: 'string',
          enum: ['security', 'system', 'info', 'warning', 'error']
        },
        severity: {
          bsonType: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'resolved', 'acknowledged']
        },
        created_at: { bsonType: 'date' },
        resolved_at: { bsonType: 'date' }
      }
    }
  }
});

// Create analysis results collection
db.createCollection('analysis_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'analysis_type', 'result', 'created_at'],
      properties: {
        user_id: { bsonType: 'string' },
        analysis_type: {
          bsonType: 'string',
          enum: ['fake_news', 'deepfake', 'crime_prediction']
        },
        result: { bsonType: 'object' },
        confidence: { bsonType: 'double' },
        created_at: { bsonType: 'date' }
      }
    }
  }
});

// Create API keys collection
db.createCollection('api_keys', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'key_hash', 'name', 'created_at'],
      properties: {
        user_id: { bsonType: 'string' },
        key_hash: { bsonType: 'string' },
        name: { bsonType: 'string' },
        permissions: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        last_used: { bsonType: 'date' },
        usage_count: { bsonType: 'int' },
        is_active: { bsonType: 'bool' },
        expires_at: { bsonType: 'date' },
        created_at: { bsonType: 'date' }
      }
    }
  }
});

// Create crime data collection
db.createCollection('crime_data', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['type', 'location', 'date', 'severity'],
      properties: {
        type: { bsonType: 'string' },
        location: {
          bsonType: 'object',
          properties: {
            lat: { bsonType: 'double' },
            lng: { bsonType: 'double' },
            address: { bsonType: 'string' }
          }
        },
        date: { bsonType: 'date' },
        severity: {
          bsonType: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        description: { bsonType: 'string' },
        status: {
          bsonType: 'string',
          enum: ['reported', 'investigating', 'resolved']
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ created_at: -1 });

db.alerts.createIndex({ user_id: 1, created_at: -1 });
db.alerts.createIndex({ type: 1, status: 1 });
db.alerts.createIndex({ created_at: -1 });

db.analysis_results.createIndex({ user_id: 1, created_at: -1 });
db.analysis_results.createIndex({ analysis_type: 1, created_at: -1 });

db.api_keys.createIndex({ user_id: 1, is_active: 1 });
db.api_keys.createIndex({ key_hash: 1 }, { unique: true });

db.crime_data.createIndex({ location: '2dsphere' });
db.crime_data.createIndex({ date: -1 });
db.crime_data.createIndex({ type: 1, status: 1 });

// Create initial admin user (default password - change this!)
db.users.insertOne({
  email: 'admin@cybershield.ai',
  password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq', // admin123
  name: 'System Administrator',
  role: 'admin',
  created_at: new Date(),
  updated_at: new Date(),
  two_factor: {
    enabled: false
  }
});

// Create initial demo user
db.users.insertOne({
  email: 'demo@cybershield.ai',
  password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq', // demo123
  name: 'Demo User',
  role: 'user',
  created_at: new Date(),
  updated_at: new Date(),
  two_factor: {
    enabled: false
  }
});

print('Database initialized successfully!');
print('Default users created:');
print('  Admin: admin@cybershield.ai / admin123');
print('  Demo: demo@cybershield.ai / demo123');
print('IMPORTANT: Change default passwords in production!');