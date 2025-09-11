# TODO: Remove Authentication from FAQ GET API

- [x] Edit routes/admin/faqRoutes.js to remove authMiddleware from GET routes
- [x] Edit controllers/admin/faqController.js to modify getAllFaqs to return all FAQs without adminId filter
- [x] Edit controllers/admin/faqController.js to modify getFaqById to not require adminId filter
- [ ] Test the API to ensure it works without authentication
