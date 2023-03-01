import { ObjectId as PageId, ObjectId } from 'mongodb';

/**
 * link list node
 * @property articles
 * @property nextPage
 * @property prePage
 */
export interface Page {
	_id: ObjectId;
	articles: string[];
	nextPage: PageId;
	prePage: PageId;
}

/**
 * record first page of list
 * @property listKey
 * @property firstPage
 */
export interface Head {
	_id: ObjectId;
	listKey: string;
	firstPage: PageId;
}
