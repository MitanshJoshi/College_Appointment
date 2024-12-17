import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri); 
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("E2E Test: College Appointment System", () => {
  let studentA1Token, studentA2Token, professorP1Token;
  let professorId, appointmentId;

  it("should authenticate users and execute the entire flow", async () => {
    const studentA1 = await request(app).post("/api/v1/user/register").send({
      email: "mitans@gmail.com",
      name:"mitans",
      password: "12345678",
      role: "student",
    });
    studentA1Token = (await request(app).post("/api/v1/user/login").send({
      email: "mitans@gmail.com",
      password: "12345678",
    })).body.token;
    console.log('Student A1 authenticates to access the system.');
    
    const studentA2 = await request(app).post("/api/v1/user/register").send({
      email: "vj@gmail.com",
      name:"vj",
      password: "12345678",
      role: "student",
    });

    const professorP1 = await request(app).post("/api/v1/user/register").send({
      email: "prof1@gmail.com",
      name:"prof1",
      password: "12345678",
      role: "professor",
    });
    professorP1Token = (await request(app).post("/api/v1/user/login").send({
      email: "prof1@gmail.com",
      password: "12345678",
    })).body.token;
    console.log('Professor P1 authenticates to access the system.');
    
    professorId = professorP1.body.user._id;

    const availabilityResponse = await request(app)
    .post("/api/v1/availability/setAvailabality")
    .set("Cookie", `token=${professorP1Token}`)
    .send({
        "slots": ["09:00", "10:30", "14:00"],
    });
    console.log('Professor P1 specifies which time slots he is free for appointments Passed.');
    
expect(availabilityResponse.statusCode).toBe(200);

const availableSlots = await request(app)
    .get(`/api/v1/availability/getAvailability/${professorId}`)
    .set("Cookie", `token=${studentA1Token}`);
    expect(availableSlots.statusCode).toBe(200);
console.log('Student A1 views available time slots for Professor P1.');

    const bookAppointmentA1 = await request(app)
      .post("/api/v1/appointment/bookAppointment")
      .set("Cookie", `token=${studentA1Token}`)
      .send({
        professorId,
        timeSlot: "09:00",
      });

    expect(bookAppointmentA1.statusCode).toBe(201);
    console.log('Student A1 books an appointment with Professor P1 for time T1.');
    
    appointmentId = bookAppointmentA1.body.appointment._id;
    
    studentA2Token = (await request(app).post("/api/v1/user/login").send({ 
      email: "vj@gmail.com",
      password: "12345678",
    })).body.token;
    console.log('Student A2 authenticates to access the system.');
    
    const bookAppointmentA2 = await request(app)
      .post("/api/v1/appointment/bookAppointment")
      .set("Cookie", `token=${studentA2Token}`)
      .send({
        professorId,
        timeSlot: "14:00",
      });

    expect(bookAppointmentA2.statusCode).toBe(201);
    console.log('Student A2 books an appointment with Professor P1 for time T2.');
    
    const cancelAppointment = await request(app)
      .delete(`/api/v1/appointment/cancelAppointment/${appointmentId}`)
      .set("Cookie", `token=${professorP1Token}`);
      
    expect(cancelAppointment.statusCode).toBe(200);
    expect(cancelAppointment.body.appointment.status).toBe("cancelled");
    console.log('Professor P1 cancels the appointment with Student A1.');
    

    const appointmentsA1 = await request(app)
  .get("/api/v1/appointment/getAppointments")
  .set("Cookie", `token=${studentA1Token}`);

    expect(appointmentsA1.body.appointments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: appointmentId,
            status: "cancelled",
          }),
        ])
      );
      console.log('Student A1 checks their appointments and realizes they do not have any pending appointments.');
      
  });
});
