const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Art = require('../models/ARTModel')

// get all Asisten Rumah Tangga
const getArts = async (req, res) => {
    try {
        const arts = await Art.find({}).sort({ createdAt: -1 })
        res.status(200).json(arts)
    } catch (error){
        res.status(400).json({ error: error.message })
    }
}

// get a single Asisten Rumah Tangga
const getArt = async (req, res) => {
    try {
        const { id } = req.params
        const art = await Art.findById(id)
        if (!art){
            return res.status(404).json({ error: 'No such Asisten Rumah Tangga'})
        }
        res.status(200).json(art)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// create new Asisten Rumah Tangga
const createArt = async (req, res) => {
    try {
        const {
            date,
            name,
            email,
            address,
            phoneNumber,
            password,
            country,
        } = req.body

        // Remove non-digit characters from the phone number
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '')
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const art = await Art.create({
            date: new Date(date),
            name,
            email,
            address,
            phoneNumber: cleanedPhoneNumber,
            password: hashedPassword,
            country,
        })
        res.status(200).json(art)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
}

// delete a Asisten Rumah Tangga
const deleteArt = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Asisten Rumah Tangga' });
      }
  
      const art = await Art.findOneAndDelete({ _id: id });
  
      if (!art) {
        return res.status(404).json({ error: 'No such Asisten Rumah Tangga' });
      }
  
      res.status(200).json(art);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// update a Asisten Rumah Tangga
const updateArt = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'no such Asisten Rumah Tangga'})
        }

        const art = await Art.findByIdAndUpdate(id, req.body, { new: true })
        
        if (!art) {
            return res.status(404).json({ error: 'No such Asisten Rumah Tangga' })
        }

        res.status(200).json(art)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports ={
    getArts,
    getArt,
    createArt,
    deleteArt,
    updateArt
}