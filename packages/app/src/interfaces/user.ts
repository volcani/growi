import { IAttachment } from './attachment';
import { Ref } from './common';
import { HasObjectId } from './has-object-id';

export type IUser = {
  name: string,
  username: string,
  email: string,
  password: string,
  image?: string, // for backward conpatibility
  imageAttachment?: Ref<IAttachment>,
  imageUrlCached: string,
  isGravatarEnabled: boolean,
  admin: boolean,
  apiToken?: string,
  isEmailPublished: boolean,
  lang: string,
  slackMemberId?: string,
}

export type IUserGroupRelation = {
  relatedGroup: Ref<IUserGroup>,
  relatedUser: Ref<IUser>,
  createdAt: Date,
}

export type IUserGroup = {
  name: string;
  createdAt: Date;
  description: string;
  parent: Ref<IUserGroupHasId> | null;
}

export type IUserHasId = IUser & HasObjectId;
export type IUserGroupHasId = IUserGroup & HasObjectId;
export type IUserGroupRelationHasId = IUserGroupRelation & HasObjectId;
