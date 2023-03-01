import { ObjectId } from 'mongodb';
import { Head, Page } from '../types/types';

export const getHead = async (listKey: string) => {
	const result = (await DBO.heads.findOne({ listKey })) as Head | null;
	if (!result) {
		return null;
	}
	return result.firstPage.toString();
};

export const getPage = async (pageId: ObjectId | string) => {
	const _id = typeof pageId == 'string' ? new ObjectId(pageId) : pageId;
	const result = (await DBO.pages.findOne({ _id })) as Page | null;
	if (!result) {
		return null;
	}
	return result;
};
