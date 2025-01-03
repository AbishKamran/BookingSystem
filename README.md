Booking System with Calendar Integration in Next.js
This is a Next.js component for a booking form that allows users to select a date and time for reservations using a calendar. It communicates with a backend API to fetch available time slots and submit bookings. This component handles the selection of available times, form validation, and displays feedback to the user with toast notifications.

Key Features:

Calendar Integration: Users can pick a date from a calendar. The component will display the availability status of each date.
Available Time Slots: Fetches and displays available time slots for the selected date from the backend API.
Form Submission: Collects user information (name, email, phone, guests) and submits the booking request to the backend.
Input Validation: Ensures all fields are filled out, validates phone number length, and handles missing or invalid form submissions.
Toast Notifications: Provides real-time feedback to users (success or error messages) based on form submission and server responses.
Dynamic UI: Updates the UI to reflect booked or available dates, providing a real-time interactive experience.
