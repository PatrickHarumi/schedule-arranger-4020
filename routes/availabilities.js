'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });

router.post(
  '/:scheduleId/users/:userId/candidates/:candidateId',
  authenticationEnsurer,
  async (req, res, next) => {
    const scheduleId = req.params.scheduleId;
    const userId = parseInt(req.params.userId);
    const candidateId = parseInt(req.params.candidateId);
    let availability = req.body.availability;
    availability = availability ? parseInt(availability) : 0;

    const data = {
      userId,
      scheduleId,
      candidateId,
      availability
    };
//    console.log(`scheduleId=${scheduleId}, userId=${userId}, candidateId=${candidateId}, availability=${availability};`);
    await prisma.availability.upsert({
      where: {
        availabilityCompositeId: {
          candidateId,
          userId
        }
      },
      create: data,
      update: data
    });
    console.log(`availability=${availability};`);
    res.json({ status: 'OK', availability: availability });
  }
);

module.exports = router;