import { ObjectId as PageId, ObjectId, Timestamp } from 'mongodb';

/**
 * link list node
 * @property articles
 * @property nextPage
 * @property prePage
 * @property headKey
 */
export interface Page {
	_id?: ObjectId;
	articles: string[];
	headKey: string | null;
	nextPage: PageId | null;
	prePage: PageId | null;
}
