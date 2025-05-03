import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Customer, CustomerGroup } from '../models/customer.model.js';
import { Consultant } from '../models/consultant.model.js';
import { Work } from '../models/work.model.js';
import { Message } from '../models/message.model.js';
import { Notification } from '../models/notification.model.js';
import { Turnover } from '../models/turnover.model.js';
import { Payroll } from '../models/payroll.model.js';
import { CustomerDocument } from '../models/customerDocument.model.js';

const tenantConnections = new Map();

export const getTenantConnection = async (tenantId, databaseName) => {
  if (tenantConnections.has(tenantId)) {
    return tenantConnections.get(tenantId);
  }

  const uri = process.env.MONGODB_URL.replace('Taskflow', databaseName);
  const connection = await mongoose.createConnection(uri);

  const models = {
    User: connection.model('User', User.schema),
    Customer: connection.model('Customer', Customer.schema),
    CustomerGroup: connection.model('CustomerGroup', CustomerGroup.schema),
    Consultant: connection.model('Consultant', Consultant.schema),
    Work: connection.model('Work', Work.schema),
    Message: connection.model('Message', Message.schema),
    Notification: connection.model('Notification', Notification.schema),
    Turnover: connection.model('Turnover', Turnover.schema),
    Payroll: connection.model('Payroll', Payroll.schema),
  };

  tenantConnections.set(tenantId, { connection, models });
  return { connection, models };
};
