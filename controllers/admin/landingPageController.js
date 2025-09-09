const LandingPageData = require('../../models/admin/LandingPageModel.js');

// 📌 POST /api/landing
exports.createLanding = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.adminId) {
      return res.status(400).json({ success: false, message: 'adminId is required' });
    }

    // Handle image uploads
    if (req.files) {
      if (req.files.profileImage?.length)
        data.profileImage = '/uploads/landing/' + req.files.profileImage[0].filename;

           if (req.files && req.files.section2_Image?.length) {
  updateData.section2_Image = '/uploads/section2Image/' + req.files.section2_Image[0].filename;
}
      
    }

    const result = await LandingPageData.create(data);
    res.status(201).json({ success: true, data: result });

  } catch (err) {
    console.error('❌ Sequelize Error:', err.original || err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 GET /api/landing/:adminId
exports.getLandingByAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const landing = await LandingPageData.findOne({ where: { adminId } });

    if (!landing) {
      return res.status(404).json({ success: false, message: 'Landing data not found' });
    }

    res.json({ success: true, data: landing });

  } catch (err) {
    console.error('❌ Error in GET Landing:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 PUT /api/landing/:id
exports.updateLanding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await LandingPageData.findByPk(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Landing data not found' });
    }

    const updated = await existing.update(req.body);
    res.json({ success: true, data: updated });

  } catch (err) {
    console.error('❌ Error in PUT Landing:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 PATCH /api/landing/:id
exports.partialUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await LandingPageData.findByPk(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Landing data not found' });
    }

    // Start with existing data
    const updateData = { ...existing.toJSON() };

    // Merge request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined && req.body[key] !== '') {
          updateData[key] = req.body[key];
        }
      });
    }

    // Merge uploaded files
    if (req.files) {
      if (req.files.profileImage?.length) {
        updateData.profileImage = '/uploads/landing/' + req.files.profileImage[0].filename;
      }
      if (req.files && req.files.section2_Image?.length) {
  updateData.section2_Image = '/uploads/section2Image/' + req.files.section2_Image[0].filename;
}

    
    }

    // Update record
    const updated = await existing.update(updateData);
    res.json({ success: true, data: updated });

  } catch (err) {
    console.error('❌ Error in PATCH Landing:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};





// 📌 DELETE /api/landing/:id
exports.deleteLanding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await LandingPageData.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Landing data not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });

  } catch (err) {
    console.error('❌ Error in DELETE Landing:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
