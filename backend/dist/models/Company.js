import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const CompanySchema = new Schema({
    company_id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    website: { type: String },
    industry: { type: String },
    size: { type: String },
    headquarters: { type: String },
    linkedin_url: { type: String },
    enrichment_source: { type: Schema.Types.Mixed }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
export const Company = model('companies', CompanySchema);
