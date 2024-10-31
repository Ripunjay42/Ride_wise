"use client";

import React from 'react';

const AboutPage = () => {
  return (
    <div className="font-sans ">
      <section className="relative bg-cover bg-center h-screen text-white" style={{ backgroundImage: "url('/your-hero-image.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-5xl font-bold mb-4">Reimagining the Way the World Moves</h1>
          <p className="text-lg max-w-2xl">Creating new ways for people, goods, and communities to move around the world.</p>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-semibold mb-6 text-center">Our Mission</h2>
        <p className="text-center text-lg text-gray-700">
        We are RideWise. The go-getters. The kind of people who are relentless about our mission to help people go anywhere and get anything and earn their way. Movement is what we power. It’s our lifeblood. It runs through our veins. It’s what gets us out of bed each morning. It pushes us to constantly reimagine how we can move better. For you. For all the places you want to go. For all the things you want to get. For all the ways you want to earn. Across the entire world. In real time. At the incredible speed of now.

We are a tech company that connects the physical and digital worlds to help make movement happen at the tap of a button. Because we believe in a world where movement should be accessible. So you can move and earn safely. In a way that’s sustainable for our planet. And regardless of your gender, race, religion, abilities, or sexual orientation, we champion your right to move and earn freely and without fear. Of course, we haven’t always gotten it right. But we’re not afraid of failure, because it makes us better, wiser, and stronger. And it makes us even more committed to do the right thing by our customers, local communities and cities, and our incredibly diverse set of international partners.

The idea for RideWise was born on a snowy night in Tezpur University in 2024, and ever since then our DNA of reimagination and reinvention carries on. We’ve grown into a global platform powering flexible earnings and the movement of people and things in ever expanding ways. We’ve gone from connecting rides on 4 wheels to 2 wheels. From drivers with background checks to real-time verification, safety is a top priority every single day. At RideWise, the pursuit of reimagination is never finished, never stops, and is always just beginning.    
        </p>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Safety First</h3>
              <p className="text-gray-700">Ensuring the safety of our riders, drivers, and communities is our top priority.</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Innovative Solutions</h3>
              <p className="text-gray-700">We push boundaries with technology to solve transportation challenges worldwide.</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Empowering People</h3>
              <p className="text-gray-700">We create opportunities for individuals to thrive and achieve their goals.</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Sustainability</h3>
              <p className="text-gray-700">We are committed to a greener planet through eco-friendly initiatives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-10">Global Impact</h2>
        <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-10">
          We’re continuously working to make a positive impact by creating economic opportunities, connecting people and places, and reducing environmental footprints in the cities we serve.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-10 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} RideWise. All rights reserved.</p>
          <nav className="mt-4">
            <a href="" className="mr-4 text-gray-300 hover:text-white">Careers</a>
            <a href="" className="mr-4 text-gray-300 hover:text-white">Press</a>
            <a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
