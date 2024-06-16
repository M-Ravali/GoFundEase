// controllers/__test__/volunteerController.test.js

const Volunteer = require('../../models/volunteer'); // Adjust the path based on your project structure
const { createVolunteer } = require('../volunteerController'); // Adjust the path based on your project structure

jest.mock('../../models/volunteer'); // Mock the volunteer model

describe('createVolunteer', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Subject',
                message: 'Message'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should create a new volunteer', async () => {
        const mockVolunteer = {
            _id: 'mockId',
            name: 'John Doe',
            email: 'john.doe@example.com',
            subject: 'Subject',
            message: 'Message'
        };

        Volunteer.create.mockResolvedValue(mockVolunteer);

        await createVolunteer(req, res);

        expect(Volunteer.create).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Volunteer information saved',
            volunteer: mockVolunteer
        });
    });

    // Add more tests as needed
});
