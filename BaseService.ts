import {Model, Document, Types} from "mongoose";

export class BaseService<T extends Document> {
    constructor(private model: Model<T & { projectId: string }>) {}

    public toObjectId(id: string): Types.ObjectId {
        return new Types.ObjectId(id);
    }

    public async get(id: string, projectId: string, query?: any): Promise<T | null> {
        const objectId = this.toObjectId(id);
        const projectObjectId = this.toObjectId(projectId);

        const baseQuery = { _id: objectId, projectId: projectObjectId };
        const result = await this.model.findOne({ ...baseQuery, ...query }).exec();

        if (!result) {
            throw new Error(`Záznam s ID ${id} v projektu ${projectId} nebyl nalezen.`);
        }

        return result;
    }




    public async create(data: Partial<T & { projectId: string }>): Promise<T> {
        return await this.model.create(data);
    }

    public async findAll(projectId: string): Promise<T[]> {

        const objectId = this.toObjectId(projectId);
        return  await this.model.find({projectId: objectId}).exec();

    }

    public async update(id: string, projectId: string, data: Partial<T>): Promise<T | null> {
        const objectId = this.toObjectId(id);
        const projectObjectId = this.toObjectId(projectId);

        const updatedDocument = await this.model.findOneAndUpdate({_id: objectId, projectId: projectObjectId}, data, { new: true }).exec();

        if (!updatedDocument) {
            throw new Error(`Záznam s ID ${id} v projektu ${projectId} nebyl nalezen pro aktualizaci.`);
        }

        return updatedDocument;
    }


    public async delete(id: string, projectId: string): Promise<T | null> {
        const objectId = this.toObjectId(id);
        const projectObjectId = this.toObjectId(projectId);

        const deletedDocument = await this.model.findOneAndDelete({_id: objectId, projectId: projectObjectId}).exec();

        if (!deletedDocument) {
            throw new Error(`Záznam s ID ${id} v projektu ${projectId} nebyl nalezen pro smazání.`);
        }

        return deletedDocument;
    }

}
