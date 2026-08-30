import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { validationResult } from 'express-validator';

// Register a new user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      role = 'student',
      enrollmentNumber,
      department,
      semester
    } = req.body;

    if (!['student', 'organizer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'New accounts can only be registered as student or organizer'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
      canCreateEvents: role === 'organizer',
      canManageRegistrations: role === 'organizer',
      enrollmentNumber,
      department,
      semester
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, department, semester } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, department, semester },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all students (admin only)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users by role (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = {};
    if (role && ['student', 'organizer', 'admin'].includes(role)) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('managedEvents', 'title date location');

    res.json({
      success: true,
      count: users.length,
      users,
      roleBreakdown: {
        students: users.filter(u => u.role === 'student').length,
        organizers: users.filter(u => u.role === 'organizer').length,
        admins: users.filter(u => u.role === 'admin').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
