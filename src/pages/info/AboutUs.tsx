import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        About SunsetView.com
      </h1>

      {/* Hero section with image */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-72 md:h-96">
        <img
          src="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
          alt="Beautiful sunset view from a hotel balcony"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Experience Unforgettable Sunsets
            </h2>
            <p className="text-white/90">
              Helping travelers find the most beautiful sunset views since 2020
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <p className="mb-4 text-gray-700 leading-relaxed">
              Founded in 2020 by Shahil Suresh, SunsetView.com began with a
              simple idea: to help travelers find accommodations with the most
              stunning sunset views around the world. What started as a passion
              project has grown into a trusted platform connecting travelers
              with unforgettable experiences.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              After spending years traveling and collecting memories of
              breathtaking sunsets, Shahil recognized that the view from your
              accommodation can transform an ordinary stay into an extraordinary
              experience. This insight became the foundation of SunsetView.com's
              mission.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="https://images.pexels.com/photos/6762403/pexels-photo-6762403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Travelers watching sunset"
              className="w-full h-48 md:h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Our Mission</h2>
        <div className="flex flex-col md:flex-row-reverse gap-6">
          <div className="md:w-2/3">
            <p className="mb-4 text-gray-700 leading-relaxed">
              At SunsetView.com, I'm committed to curating accommodations that
              offer more than just a place to sleep. I believe that the right
              view can enhance your travel experience and create memories that
              last a lifetime.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              My mission is to make it easy for travelers to discover and book
              stays with spectacular sunset views, while providing hotel owners
              a platform to showcase their unique locations to a global audience
              of sunset enthusiasts.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="https://media.istockphoto.com/id/880722946/photo/beach-holidays-luxury-swimming-pool-with-palm-trees.jpg?s=1024x1024&w=is&k=20&c=EoXguffJWYNZhPMTLaQFULdu-I02_skelNeSozfbEso="
              alt="Ocean view hotel at sunset"
              className="w-full h-48 md:h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          What Sets Us Apart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
              alt="Curated selection"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Curated Selection
              </h3>
              <p className="text-gray-700">
                Every property on our platform is carefully reviewed to ensure
                it offers a genuine sunset experience worth your time and money.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex">
            <img
              src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
              alt="Local expertise"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Local Expertise
              </h3>
              <p className="text-gray-700">
                Extensive research into global sunset locations provides insider
                knowledge about the best times and places to witness spectacular
                sunsets.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
              alt="Traveler community"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Traveler Community
              </h3>
              <p className="text-gray-700">
                Join a community of like-minded travelers who share their sunset
                experiences and recommendations through our platform.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
              alt="Seamless booking"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Seamless Booking
              </h3>
              <p className="text-gray-700">
                Our platform makes it easy to find, compare, and book your ideal
                sunset accommodation with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          Meet the Founder
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/3 text-center">
            <img
              src="https://res.cloudinary.com/dqgooesfi/image/upload/ptzhpt5ikx636qkwa2oo.jpg"
              alt="Shahil Suresh"
              className="w-48 h-48 rounded-full mx-auto mb-3 object-cover border-4 border-orange-300"
            />
            <h3 className="font-bold text-xl text-gray-800">Shahil Suresh</h3>
            <p className="text-orange-500 font-medium">Founder & CEO</p>
          </div>
          <div className="md:w-2/3">
            <p className="mb-4 text-gray-700 leading-relaxed">
              As the sole founder and operator of SunsetView.com, I personally
              handle every aspect of the business. My journey began with a
              passion for travel and a particular love for breathtaking sunset
              views that transform a regular stay into a magical experience.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              With a background in both technology and hospitality, I've
              designed this platform to connect travelers with accommodations
              that offer exceptional sunset experiences. Every hotel listing,
              customer interaction, and platform enhancement comes directly from
              my commitment to helping you discover the perfect stay.
            </p>
            <p className="text-gray-700 leading-relaxed">
              I believe that the right view can make all the difference in your
              travel memories, and I'm dedicated to curating only the best
              sunset-focused accommodations around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Final sunset banner */}
      <div className="mt-8 rounded-xl overflow-hidden relative h-64">
        <img
          src="https://media.istockphoto.com/id/640318118/photo/sunset-over-indian-ocean.jpg?s=1024x1024&w=is&k=20&c=ZZ83CXrsxGd4HhoyV8KXgrdnoaQ9XgeAKkN_ru8taYk="
          alt="Beautiful sunset on the beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center">
          <div className="p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">
              Find Your Perfect Sunset View
            </h2>
            <p className="text-white/90">
              Begin your journey with SunsetView.com today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
