import express from 'express';
const router = express.Router();

// GetHead(“some-list-key”) → {nextPageKey: "abce"}
router.get('/get/head', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

// GetPage(“abce”) → {articles, nextPageKey: "jyds"}, GetPage(“xyaz”) → {articles}
router.get('/get/page', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

// CreateHead("some-list-key",articles) => {pageKey: "XXX"}
router.post('/create/head', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

// CreatePage("pre-pageKey",articles) => {pageKey: "XXX"}
router.post('/create/page', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

// updatePage("pageKey",articles) => {pageKey: "XXX"}
router.put('/update/page', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});
// movePage("target-pageKey","move-after-pageKey") => {pageKey: "XXX"}
router.put('/move/page', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});
// delete head
router.delete('/delete/head', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

export default router;
