import { getOrCreateModel } from '@growi/core';
import {
  Types, Document, Model, Schema,
} from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');


export interface TagDocument extends Document {
  _id: Types.ObjectId
  name: string
}

export interface TagModel extends Model<TagDocument>{
  getIdToNameMap(tagIds: Types.ObjectId)
  findOrCreate(tagName: string)
  findOrCreateMany(tagNames: string[])
}

const tagSchema = new Schema<TagDocument, TagModel>({
  name: {
    type: String,
    require: true,
    unique: true,
  },
});
tagSchema.plugin(mongoosePaginate);
tagSchema.plugin(uniqueValidator);


tagSchema.statics.getIdToNameMap = function(tagIds) {
  const tags = await this.find({ _id: { $in: tagIds } });

  const idToNameMap = {};
  tags.forEach((tag) => {
    idToNameMap[tag._id.toString()] = tag.name;
  });

  return idToNameMap;
};

tagSchema.statics.findOrCreate = function(tagName) {
  const tag = await this.findOne({ name: tagName });
  if (!tag) {
    return this.create({ name: tagName });
  }
  return tag;
};

tagSchema.statics.findOrCreateMany = function(tagNames) {
  const existTags = await this.find({ name: { $in: tagNames } });
  const existTagNames = existTags.map((tag) => { return tag.name });

  // bulk insert
  const tagsToCreate = tagNames.filter((tagName) => { return !existTagNames.includes(tagName) });
  await this.insertMany(
    tagsToCreate.map((tag) => {
      return { name: tag };
    }),
  );

  return this.find({ name: { $in: tagNames } });
};


export default getOrCreateModel<TagDocument, TagModel>('Tag', tagSchema);
