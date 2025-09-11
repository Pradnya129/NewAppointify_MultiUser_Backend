const Faq = require('../../models/admin/FaqModel.js');

// Get all FAQs for current admin
// 📌 GET /api/faqs (only specific admin's FAQs)
exports.getAllFaqs = async (req, res) => {
  try {
    // Remove adminId filtering to make FAQs public
    const faqs = await Faq.findAll();

    res.status(200).json({
      success: true,
      data: faqs,
      message: faqs.length ? "FAQs fetched successfully" : "No FAQs found"
    });
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    res.status(500).json({ 
      message: "Failed to fetch FAQs", 
      error: err.message 
    });
  }
};


// Get specific FAQ
exports.getFaqById = async (req, res) => {
  try {
    // Remove adminId filtering to make FAQ public
    const faq = await Faq.findOne({
      where: { id: req.params.id }
    });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await Faq.create({
      adminId: req.user.id,
      question,
      answer
    });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create FAQ' });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await Faq.findOne({ where: { id: req.params.id, adminId: req.user.id } });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    faq.question = question;
    faq.answer = answer;
    await faq.save();

    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update FAQ' });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findOne({ where: { id: req.params.id, adminId: req.user.id } });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    await faq.destroy();
    res.json({ message: 'FAQ is deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete FAQ' });
  }
};
