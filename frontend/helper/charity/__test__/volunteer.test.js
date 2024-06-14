/**
 * @jest-environment jsdom
 */

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('Volunteer form submission', () => {
    beforeEach(() => {
        // Reset mocks before each test
        fetch.resetMocks();

        // Set up our document body
        document.body.innerHTML = `
            <form id="volunteer-form">
                <input type="text" id="volunteer-name" value="John Doe">
                <input type="email" id="volunteer-email" value="john.doe@example.com">
                <input type="text" id="volunteer-subject" value="Subject">
                <textarea id="volunteer-message">Message</textarea>
                <button type="submit">Submit</button>
            </form>
        `;

        // Add the event listener for the form submission
        require('../path/to/volunteer.js'); // Adjust the path to your JS file
    });

    test('submits form data successfully', async () => {
        // Mock a successful fetch response
        fetch.mockResponseOnce(JSON.stringify({ message: 'Success' }), { status: 200 });

        // Mock the alert function
        window.alert = jest.fn();

        // Simulate form submission
        const form = document.getElementById('volunteer-form');
        form.dispatchEvent(new Event('submit'));

        // Wait for the fetch call to complete
        await new Promise(setImmediate);

        // Assert fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/volunteer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Subject',
                message: 'Message'
            })
        });

        // Assert that the alert was called with the success message
        expect(window.alert).toHaveBeenCalledWith('Volunteer form submitted successfully');
    });

    test('handles form submission failure', async () => {
        // Mock a failed fetch response
        fetch.mockResponseOnce(JSON.stringify({ message: 'Error' }), { status: 400 });

        // Mock the alert function
        window.alert = jest.fn();

        // Simulate form submission
        const form = document.getElementById('volunteer-form');
        form.dispatchEvent(new Event('submit'));

        // Wait for the fetch call to complete
        await new Promise(setImmediate);

        // Assert fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/volunteer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Subject',
                message: 'Message'
            })
        });

        // Assert that the alert was called with the failure message
        expect(window.alert).toHaveBeenCalledWith('Volunteer form submission failed');
    });

    test('handles fetch error', async () => {
        // Mock a fetch network error
        fetch.mockReject(new Error('Network error'));

        // Mock the alert function
        window.alert = jest.fn();

        // Simulate form submission
        const form = document.getElementById('volunteer-form');
        form.dispatchEvent(new Event('submit'));

        // Wait for the fetch call to complete
        await new Promise(setImmediate);

        // Assert fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/volunteer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Subject',
                message: 'Message'
            })
        });

        // Assert that the alert was called with the error message
        expect(window.alert).toHaveBeenCalledWith('Error: Network error');
    });
});
