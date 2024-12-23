// pages/contact.js
'use client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Contact = () => {
    const [emailjs, setEmailjs] = useState(null);

    useEffect(() => {
        const loadEmailJs = async () => {
            const emailjsModule = await import('@emailjs/browser');
            emailjsModule.default.init('5Y5xWVUAuf8lKI0Na');
            setEmailjs(emailjsModule.default);
        };
        
        loadEmailJs();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!emailjs) {
            console.error('EmailJS not loaded');
            return;
        }

        try {
            await emailjs.sendForm('service_q53iraz', 'template_d2dpd7y', event.target);
            
            await Swal.fire({
                title: "Success",
                text: "Your message has been sent successfully!",
                icon: "success"
            });
            
            window.location.reload();
            
        } catch (error) {
            console.error('Failed to send email:', error);
            
            await Swal.fire({
                title: "Failed",
                text: "Your message could not be sent!",
                icon: "error"
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-black-600">Contact RideWise</h1>
                <p className="text-gray-600">Have questions about driving with RideWise? We&apos;re here to give you answers.</p>
            </header>
            
            <main>
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold text-black-600">Get in Touch</h2>
                    <p className="text-gray-700">If you have questions or need assistance, please reach out to us.</p>
                    <ul className="list-disc ml-5 mt-4 text-gray-700">
                        <li><strong>Email:</strong> contactridewise@gmail.com</li>
                        <li><strong>Phone:</strong> +91 6003644157</li>
                        <li><strong>Address:</strong> Kanchenjungha Men&apos;s Hostel, Tezpur University</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-black-600">Contact Form</h2>
                    <form id="contact-form" onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700">Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required 
                                className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700">Message:</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows="4" 
                                required 
                                className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-1/5 mt-4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
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