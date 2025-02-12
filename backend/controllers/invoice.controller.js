import Invoice from "../models/invoice.model";


export const createInvoice = async (req, res) => {
    try {
        const {
            serialNo,
            invoiceId,
            partyName,
            workName,
            year,
            price,
            quantity,
            discount,
            tax,
            taxAmount,
            total,
            mode,
        } = req.body;
  
        const newInvoice = new Invoice({
            serialNo,
            invoiceId,
            partyName,
            workName,
            year,
            price,
            quantity,
            discount,
            tax,
            taxAmount,
            total,
            mode,
        });
  
        await newInvoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  };
  