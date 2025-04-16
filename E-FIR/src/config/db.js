// import mongoose from 'mongoose';

// // MongoDB connection (kept from backend)
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/efir_db', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     return conn;
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     // For frontend demo, don't exit process on error
//     console.log('Using mock data for frontend demonstration');
//     return null;
//   }
// };

// Mock data for frontend demo (only for testing purposes)
// const mockFIRData = [
//   {
//     _id: '1',
//     firNumber: 'FIR001',
//     complainantName: 'Rahul Sharma',
//     complainantPhone: '9876543210',
//     accusedName: 'Unknown',
//     incidentDate: '2023-03-10',
//     incidentLocation: 'Sector 17, Pune',
//     incidentType: 'Theft',
//     description: 'Mobile phone stolen from public area',
//     status: 'Under Investigation',
//     assignedOfficer: 'Insp. Patil',
//     createdAt: '2023-03-11',
//   },
//   {
//     _id: '2',
//     firNumber: 'FIR002',
//     complainantName: 'Priya Patel',
//     complainantPhone: '9876543211',
//     accusedName: 'Vijay Kumar',
//     incidentDate: '2023-03-05',
//     incidentLocation: 'MG Road, Pune',
//     incidentType: 'Assault',
//     description: 'Physical altercation at local shop',
//     status: 'Filed',
//     assignedOfficer: 'Insp. Deshmukh',
//     createdAt: '2023-03-06',
//   },
//   {
//     _id: '3',
//     firNumber: 'FIR003',
//     complainantName: 'Amit Singh',
//     complainantPhone: '9876543212',
//     accusedName: 'Local Gang',
//     incidentDate: '2023-03-08',
//     incidentLocation: 'Kothrud, Pune',
//     incidentType: 'Vandalism',
//     description: 'Property damaged during night hours',
//     status: 'Closed',
//     assignedOfficer: 'Insp. Sharma',
//     createdAt: '2023-03-09',
//   },
// ];

// // Mock dashboard stats
// const mockStats = {
//   totalFIRs: 156,
//   pendingFIRs: 42,
//   resolvedFIRs: 98,
//   rejectedFIRs: 16,
//   monthlyCounts: [12, 15, 18, 14, 22, 19, 25, 17, 14, 0, 0, 0],
// };

// export { mockFIRData, mockStats };