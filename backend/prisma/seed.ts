import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CareConnect database...');

  // Password for all demo accounts
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: passwordHash,
      name: 'CareConnect Admin',
      phone: '+91 99000 11122',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2. Family Member User
  const familyMember = await prisma.user.upsert({
    where: { email: 'preeti@example.com' },
    update: {},
    create: {
      email: 'preeti@example.com',
      password: passwordHash,
      name: 'Preeti Sharma',
      phone: '+91 98765 43210',
      role: 'FAMILY_MEMBER',
      status: 'ACTIVE',
    },
  });

  // 3. Parent User
  const parentUser = await prisma.user.upsert({
    where: { email: 'lakshmi@example.com' },
    update: {},
    create: {
      email: 'lakshmi@example.com',
      password: passwordHash,
      name: 'Lakshmi Sharma',
      phone: '+91 98765 43211',
      role: 'PARENT',
      status: 'ACTIVE',
    },
  });

  // 4. Caregiver User
  const caregiverUser = await prisma.user.upsert({
    where: { email: 'ravi@example.com' },
    update: {},
    create: {
      email: 'ravi@example.com',
      password: passwordHash,
      name: 'Ravi Kumar',
      phone: '+91 98765 43212',
      role: 'CAREGIVER',
      status: 'ACTIVE',
    },
  });

  // Create Parent Profile
  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      age: 68,
      address: '102 Park Avenue, Indiranagar, Bangalore, Karnataka',
      emergencyNotes: 'History of Hypertension. Allergic to Penicillin.',
    },
  });

  // Create Caregiver Profile
  const caregiverProfile = await prisma.caregiverProfile.upsert({
    where: { userId: caregiverUser.id },
    update: {},
    create: {
      userId: caregiverUser.id,
      location: 'Indiranagar, Bangalore',
      experienceYears: 3,
      skills: 'Elder Care, Post-Op Care, Mobility Assistance, Vital Monitoring',
      availabilityStatus: 'Available',
      isVerified: true,
      rating: 4.8,
      completedVisitsCount: 126,
      bio: 'Experienced and compassionate care assistant specializing in senior home care and medical appointments accompaniment.',
    },
  });

  // Create Family Connection (Preeti -> Lakshmi)
  await prisma.familyConnection.upsert({
    where: {
      familyMemberId_parentProfileId: {
        familyMemberId: familyMember.id,
        parentProfileId: parentProfile.id,
      },
    },
    update: {},
    create: {
      familyMemberId: familyMember.id,
      parentProfileId: parentProfile.id,
      permissionLevel: 'FULL_ACCESS',
      status: 'ACCEPTED',
    },
  });

  // Medications
  const med1 = await prisma.medication.create({
    data: {
      parentProfileId: parentProfile.id,
      name: 'Blood Pressure Tablet (Amlodipine 5mg)',
      dosage: '1 Tablet',
      timeOfDay: '08:00 AM',
      frequency: 'Every day',
      startDate: '2026-01-01',
      instructions: 'Take after breakfast with warm water',
      createdById: familyMember.id,
    },
  });

  const med2 = await prisma.medication.create({
    data: {
      parentProfileId: parentProfile.id,
      name: 'Multivitamin Supplement',
      dosage: '1 Capsule',
      timeOfDay: '01:00 PM',
      frequency: 'Every day',
      startDate: '2026-01-01',
      instructions: 'Take after lunch',
      createdById: familyMember.id,
    },
  });

  const med3 = await prisma.medication.create({
    data: {
      parentProfileId: parentProfile.id,
      name: 'Cholesterol Tablet (Atorvastatin 10mg)',
      dosage: '1 Tablet',
      timeOfDay: '09:00 PM',
      frequency: 'Every day',
      startDate: '2026-01-01',
      instructions: 'Take before sleep',
      createdById: familyMember.id,
    },
  });

  // Medication Logs for Today
  const todayStr = new Date().toISOString().split('T')[0];

  await prisma.medicationLog.create({
    data: {
      medicationId: med1.id,
      parentProfileId: parentProfile.id,
      scheduledTime: '08:00 AM',
      status: 'TAKEN',
      takenAt: new Date(),
      notes: 'Taken on time after breakfast',
    },
  });

  await prisma.medicationLog.create({
    data: {
      medicationId: med2.id,
      parentProfileId: parentProfile.id,
      scheduledTime: '01:00 PM',
      status: 'SCHEDULED',
    },
  });

  // Appointments
  await prisma.appointment.create({
    data: {
      parentProfileId: parentProfile.id,
      doctorName: 'Dr. Ramesh Sharma',
      hospitalName: 'Manipal Hospital, Old Airport Road',
      appointmentDate: '2026-08-18',
      time: '04:30 PM',
      purpose: 'Routine Hypertension & Cardiac Evaluation',
      location: 'Cardiology Department, 3rd Floor',
      notes: 'Bring previous blood pressure check logbook',
      status: 'UPCOMING',
      createdById: familyMember.id,
    },
  });

  // CheckIns
  await prisma.checkIn.create({
    data: {
      parentProfileId: parentProfile.id,
      mood: 'GOOD',
      notes: 'Feeling good today! Enjoyed morning tea on the balcony.',
      date: todayStr,
      time: '10:15 AM',
    },
  });

  // Emergency Contacts
  await prisma.emergencyContact.createMany({
    data: [
      {
        parentProfileId: parentProfile.id,
        name: 'Preeti Sharma',
        relationship: 'Daughter (Primary)',
        phone: '+91 98765 43210',
        priority: 1,
      },
      {
        parentProfileId: parentProfile.id,
        name: 'Rahul Sharma',
        relationship: 'Son',
        phone: '+91 98765 43211',
        priority: 2,
      },
      {
        parentProfileId: parentProfile.id,
        name: 'Indiranagar Local Clinic / Dr. Gupta',
        relationship: 'Family Physician',
        phone: '+91 80252 00100',
        priority: 3,
      },
    ],
  });

  // Care Request & Visit
  const careReq = await prisma.careRequest.create({
    data: {
      parentProfileId: parentProfile.id,
      requestedById: familyMember.id,
      requestType: 'HOSPITAL_ACCOMPANIMENT',
      description: 'Accompany mom to Manipal Hospital for her 4:30 PM doctor appointment',
      preferredDate: '2026-08-18',
      preferredTime: '04:00 PM',
      location: '102 Park Avenue, Indiranagar, Bangalore',
      status: 'ACCEPTED',
    },
  });

  await prisma.careVisit.create({
    data: {
      careRequestId: careReq.id,
      caregiverProfileId: caregiverProfile.id,
      status: 'ACCEPTED',
      notes: 'Caregiver Ravi confirmed assignment for Aug 18th.',
    },
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: familyMember.id,
        type: 'MEDICINE_REMINDER',
        title: 'Morning Medicine Taken',
        message: 'Lakshmi Sharma marked Blood Pressure Tablet as taken.',
        isRead: false,
      },
      {
        userId: familyMember.id,
        type: 'CARE_REQUEST_ACCEPTED',
        title: 'Care Request Accepted',
        message: 'Caregiver Ravi Kumar accepted the Hospital Accompaniment request.',
        isRead: false,
      },
      {
        userId: parentUser.id,
        type: 'MEDICINE_REMINDER',
        title: 'Medicine Reminder',
        message: 'Time to take your Multivitamin Supplement (1:00 PM).',
        isRead: false,
      },
    ],
  });

  // Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        parentProfileId: parentProfile.id,
        actorId: parentUser.id,
        action: 'MEDICINE_TAKEN',
        details: 'Marked Blood Pressure Tablet (Amlodipine 5mg) as taken',
      },
      {
        parentProfileId: parentProfile.id,
        actorId: parentUser.id,
        action: 'DAILY_CHECKIN',
        details: 'Completed daily check-in: Feeling Good 😊',
      },
      {
        parentProfileId: parentProfile.id,
        actorId: familyMember.id,
        action: 'CARE_REQUEST_CREATED',
        details: 'Created hospital accompaniment care visit request for Aug 18',
      },
      {
        parentProfileId: parentProfile.id,
        actorId: caregiverUser.id,
        action: 'CARE_REQUEST_ACCEPTED',
        details: 'Caregiver Ravi Kumar accepted the visit request',
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`
  ==============================================
  CareConnect Demo Accounts:
  ----------------------------------------------
  Family Member: preeti@example.com  / Password123!
  Parent:        lakshmi@example.com / Password123!
  Caregiver:     ravi@example.com    / Password123!
  Admin:         admin@example.com   / Password123!
  ==============================================
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
