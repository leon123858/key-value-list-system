import { ModifyResult, ObjectId } from 'mongodb';
import { Page } from '../types/types';

/**
 * 依照列表 key 獲取第一分頁
 * @param listKey
 * @returns 第一分頁 id
 */
export const getHead = async (listKey: string) => {
	if (typeof listKey !== 'string') {
		throw 'Wrong type of listKey';
	}
	const result = (await DBO.pages.findOne({
		headKey: listKey,
		prePage: null,
	})) as Page | null;
	if (!result) {
		return null;
	}
	return result._id?.toString();
};

/**
 * 依照分頁 id 獲取分頁內容與相關資訊
 * @param pageId
 * @returns 分頁完整內容
 */
export const getPage = async (pageId: ObjectId | string) => {
	const _id = typeof pageId == 'string' ? new ObjectId(pageId) : pageId;
	const result = (await DBO.pages.findOne({ _id })) as Page | null;
	if (!result) {
		return null;
	}
	return result;
};

/**
 * 創建 link list 第一頁
 * @param articles
 * @param headKey
 * @returns 創建成功的 page 編號
 */
export const createHead = async (articles: string[], headKey: string) => {
	if (typeof headKey !== 'string' || Array.isArray(articles) === false) {
		throw 'Wrong type of parameters';
	}
	if (headKey == '') {
		throw 'key of list can not be empty';
	}
	const newHead: Page = {
		articles,
		nextPage: null,
		prePage: null,
		headKey,
	};
	const result = await DBO.pages.insertOne(newHead);
	return result.insertedId;
};

/**
 * 創建 link list 的 page, 非第一頁
 * @param articles
 * @returns 創建成功的 page 編號
 */
export const createPage = async (articles: string[]) => {
	if (Array.isArray(articles) === false) {
		throw 'Wrong type of parameters';
	}
	const newPage: Page = {
		articles,
		nextPage: null,
		prePage: null,
		headKey: null,
	};
	const result = await DBO.pages.insertOne(newPage);
	return result.insertedId;
};

/**
 * 更新 page 內容
 * @param pageId
 * @param articles 新內容
 */
export const updatePageArticles = async (
	pageId: ObjectId | string,
	articles: string[]
) => {
	const _id = typeof pageId == 'string' ? new ObjectId(pageId) : pageId;
	const result = await DBO.pages.updateOne(
		{ _id },
		{ $set: { articles } as Pick<Page, 'articles'> }
	);
	if (!result.modifiedCount) {
		throw 'target not exist';
	}
};

/**
 * 連接兩段 link list, 若出現錯誤, 自動回朔
 * @param fromPage
 * @param toPage
 * @param pageKey fromPage 所在列表的首位 key
 * @warning 基於效能, 不處理環狀 link-list
 */
export const linkPage = async (
	fromPage: ObjectId | string,
	toPage: ObjectId | string,
	pageKey: string
) => {
	if (!fromPage || !toPage) {
		throw 'Should exist each page';
	}
	const toPageId = typeof toPage === 'string' ? new ObjectId(toPage) : toPage;
	const fromPageId =
		typeof fromPage === 'string' ? new ObjectId(fromPage) : fromPage;
	const [toResult, fromResult] = await Promise.all([
		DBO.pages.findOneAndUpdate(
			{ _id: toPageId },
			{
				$set: {
					prePage: fromPageId,
					headKey: pageKey,
				} as Pick<Page, 'prePage' | 'headKey'>,
			}
		) as unknown as Promise<ModifyResult<Page>>,
		DBO.pages.findOneAndUpdate(
			{ _id: fromPageId },
			{
				$set: {
					nextPage: toPageId,
					headKey: pageKey,
				} as Pick<Page, 'nextPage'>,
			}
		) as unknown as Promise<ModifyResult<Page>>,
	]);
	if (
		toResult.value &&
		fromResult.value &&
		fromResult.value.headKey === pageKey
	) {
		return;
	}
	// revert when page not exist
	if (toResult.value == null || fromResult.value?.headKey != pageKey) {
		await DBO.pages.updateOne(
			{ _id: fromPageId },
			{
				$set: {
					nextPage: fromResult.value?.nextPage || null,
					headKey: fromResult.value?.headKey || null,
				} as Pick<Page, 'nextPage' | 'headKey'>,
			}
		);
	}
	if (fromResult.value == null || fromResult.value?.headKey != pageKey) {
		await DBO.pages.findOneAndUpdate(
			{ _id: toPageId },
			{
				$set: {
					prePage: toResult.value?.prePage || null,
					headKey: toResult.value?.headKey || null,
				} as Pick<Page, 'prePage' | 'headKey'>,
			}
		);
	}
};

/**
 * 刪除所有以 headKey 為 head 的 link list page
 * @param headKey link list head 鍵值
 */
export const deleteHead = async (headKey: string) => {
	if (typeof headKey != 'string') {
		throw 'Should input headKey as parameter';
	}
	await DBO.pages.deleteMany({
		headKey,
	});
};
