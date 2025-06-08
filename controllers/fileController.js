const File = require('../models/File');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.uploadFile = async (req, res) => {
  try {
        console.log("wekufh" ,req?.user, req?.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/json'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File type not allowed' });
    }

    const file = new File({
      filename: req.file.originalname,
      path: req.file.path,
       mimetype: req.file.mimetype,
      size: req.file.size,
        data: req.file.buffer,  
      uuid: uuidv4(),
      user: req.user.id
    });
    await file.save();

    res.status(201).json({
      id: file._id,
      filename: file.filename,
      size: file.size,
      uuid: file.uuid,
      createdAt: file.createdAt,
      data:  file.data,
      mimetype: file.mimetype
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Content-Length': file.size
    });

    res.send(file.data);
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
};