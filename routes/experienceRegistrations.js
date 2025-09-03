const express = require('express');
const router = express.Router();
const ExperienceRegistration = require('../models/ExperienceRegistration');

// GET all experience registrations
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const registrations = await ExperienceRegistration.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ExperienceRegistration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching experience registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đăng ký',
      error: error.message
    });
  }
});

// POST create new experience registration
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Tên và số điện thoại là bắt buộc'
      });
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ'
      });
    }

    // Check if phone already exists in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingRegistration = await ExperienceRegistration.findOne({
      phone: phone.replace(/\s/g, ''),
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại này đã đăng ký trong vòng 24 giờ qua'
      });
    }

    // Create new registration
    const registration = new ExperienceRegistration({
      name: name.trim(),
      phone: phone.replace(/\s/g, ''),
      email: email ? email.trim() : undefined
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký trải nghiệm thành công! Chúng tôi sẽ liên hệ bạn sớm.',
      data: {
        id: registration._id,
        name: registration.name,
        phone: registration.phone,
        registeredAt: registration.registeredAt
      }
    });

  } catch (error) {
    console.error('Error creating experience registration:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message
    });
  }
});

// PUT update registration status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, contactedAt } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (contactedAt) updateData.contactedAt = contactedAt;

    const registration = await ExperienceRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: registration
    });

  } catch (error) {
    console.error('Error updating experience registration:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật',
      error: error.message
    });
  }
});

// DELETE registration
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await ExperienceRegistration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký'
      });
    }

    res.json({
      success: true,
      message: 'Xóa đăng ký thành công'
    });

  } catch (error) {
    console.error('Error deleting experience registration:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa',
      error: error.message
    });
  }
});

// GET statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await ExperienceRegistration.countDocuments();
    const pending = await ExperienceRegistration.countDocuments({ status: 'pending' });
    const contacted = await ExperienceRegistration.countDocuments({ status: 'contacted' });
    const completed = await ExperienceRegistration.countDocuments({ status: 'completed' });
    
    // Registrations in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await ExperienceRegistration.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    console.log('Fetching statistics for experience registrations...');
    console.log('Total registrations:', total);
    console.log('Pending registrations:', pending);
    console.log('Contacted registrations:', contacted);
    console.log('Completed registrations:', completed);
    console.log('Recent registrations (last 7 days):', recentRegistrations);

    res.json({
      success: true,
      data: {
        total,
        pending,
        contacted,
        completed,
        recentRegistrations
      }
    });

  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message
    });
  }
});

module.exports = router;
