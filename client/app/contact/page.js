// pages/contact.js
import React from 'react';

const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-black-600">Contact RideWise</h1>
                <p className="text-gray-600">Have questions about driving with RideWise? We’re here to give you answers.</p>
            </header>
            
            <main>
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold text-black-600">Get in Touch</h2>
                    <p className="text-gray-700">If you have questions or need assistance, please reach out to us.</p>
                    <ul className="list-disc ml-5 mt-4 text-gray-700">
                        <li><strong>Email:</strong> support@ridewise.com</li>
                        <li><strong>Phone:</strong> +91 6003644157</li>
                        <li><strong>Address:</strong> Kanchenjungha Men's Hostel, Tezpur University</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-black-600">Contact Form</h2>
                    <form action="#" method="POST" className="mt-4">
                        <label htmlFor="name" className="block text-gray-700">Name:</label>
                        <input type="text" id="name" name="name" required className="mt-1 p-2 border rounded w-full" />

                        <label htmlFor="email" className="block text-gray-700 mt-4">Email:</label>
                        <input type="email" id="email" name="email" required className="mt-1 p-2 border rounded w-full" />

                        <label htmlFor="message" className="block text-gray-700 mt-4">Message:</label>
                        <textarea id="message" name="message" rows="4" required className="mt-1 p-2 border rounded w-full"></textarea>

                        <button type="submit" className="mt-4 bg-purple-600 text-white p-2 rounded hover:bg-blue-700 transition">Submit</button>
                    </form>
                </section>
            </main>

            <footer className="text-center mt-6">
                <p className="text-gray-600">&copy; 2024 RideWise. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Contact;