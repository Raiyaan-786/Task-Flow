import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: { 
            type: 
            String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        assignedTo: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        status: { 
            type: String, 
            enum: ['Pending', 'In Progress', 'Completed'], 
            default: 'Pending' 
        },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        }
    },{timestamps: true}
);
export const Task = mongoose.model('Task', taskSchema);
