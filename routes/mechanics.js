const express = require('express');
const router = express.Router();
const Mechanic = require('../models/Mechanic');

function haversine(a, b) {
  const toRad = d => d * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

router.get('/', async (req, res) => {
  try {
    const { q, service, city, lat, lng, sort } = req.query;
    const filters = {};
    if (service) filters.services = service;
    if (city) filters.city = new RegExp(city, 'i');

    let docs;
    if (q) {
      const words = q.split(/\s+/).filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, ''));
      const any = words.length ? words.join('|') : q;
      const regex = new RegExp(any, 'i');
      docs = await Mechanic.find({
        ...filters,
        $or: [
          { name: regex },
          { address: regex },
          { city: regex },
          { street: regex },
          { services: { $in: words } }
        ]
      }).lean();
    } else {
      docs = await Mechanic.find(filters).lean();
    }

    if (lat && lng) {
      const loc = { lat: parseFloat(lat), lng: parseFloat(lng) };
      docs.forEach(d => {
        if (d.lat != null && d.lng != null) {
          d.distance = haversine(loc, { lat: d.lat, lng: d.lng });
        } else d.distance = null;
      });
      if (sort === 'distance' || (!sort && lat && lng)) {
        docs.sort((a, b) => (a.distance || 1e9) - (b.distance || 1e9));
      }
    }

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const mech = new Mechanic(req.body);
    await mech.save();
    res.status(201).json(mech);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/seed', async (req, res) => {
  try {
    const count = await Mechanic.countDocuments();
    if (count > 0) return res.json({ seeded: false, message: 'Already has data' });

    const sample = [
      { name:'QuickFix Motors', phone:'+919876543210', email:'quickfix@example.com', services:['flat_tire','battery','fuel'], lat:13.0827, lng:80.2707, address:'Anna Salai', city:'Chennai', street:'Anna Salai' },
      { name:'Highway Assist', phone:'+919111223344', email:'highway@example.com', services:['towing','engine','battery'], lat:13.0012, lng:80.2566, address:'ECR Road', city:'Chennai', street:'ECR' },
      { name:'City Tyres & Tow', phone:'+919555666777', email:'citytyres@example.com', services:['flat_tire','towing'], lat:12.9968, lng:80.2211, address:'Old Mahabalipuram Rd', city:'Chennai', street:'OMR' },
      { name:'Mega Service Hub', phone:'+919333222111', email:'mega@example.com', services:['engine','battery','fuel','flat_tire'], lat:13.0500, lng:80.2655, address:'Mount Road', city:'Chennai', street:'Mount Road' },
      { name:'Rapid Road Rescue', phone:'+919700112233', email:'rapid@example.com', services:['fuel','battery'], lat:13.0700, lng:80.3000, address:'Raja St', city:'Chennai', street:'Raja St' },
      { name:'Coastal Mechanics', phone:'+919600445566', email:'coastal@example.com', services:['engine','flat_tire'], lat:13.1200, lng:80.2500, address:'Beach Road', city:'Chennai', street:'Beach Road' }
    ];
    await Mechanic.insertMany(sample);
    res.json({ seeded:true, count: sample.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seed failed' });
  }
});

module.exports = router;