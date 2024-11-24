import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { motion } from "framer-motion"; // Changed to framer-motion for animation
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, setshowlogin } = useContext(AppContext);
  const navigate = useNavigate();

  const handleclick = () => {
    if (user) {
      navigate('/result');
    } else {
      setshowlogin(true);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center space-y-6 p-4 mt-10"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Light grey background section */}
      <motion.div
        className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm">Best text to image generator</p>
        <img src={assets.star_icon} alt="Star Icon" className="w-4 h-4" />
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="text-black text-5xl font-medium mt-4"
        style={{ lineHeight: '1.2' }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 2 }}
        animate={{ opacity: 1 }}
      >
        Turn text to<br />
        <span className="text-blue-500">image,</span> in seconds.
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-black text-base mt-1"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Unleash your creativity with AI. Turn your imagination into visual art in seconds -
        <br />
        Just type, and watch the magic happen.
      </motion.p>

      {/* Button */}
      <motion.button
        onClick={handleclick}
        className="bg-black text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-gray-800 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          default: { duration: 0.5 },
          opacity: { delay: 0.8, duration: 1 },
        }}
      >
        <span>Generate Images</span>
        <img src={assets.star_group} alt="Star Group" className="w-5 h-5" />
      </motion.button>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 1, duration: 1 }}
        animate={{ opacity: 1 }}
        className="flex space-x-4 mt-6"
      >
        {Array(6)
          .fill('')
          .map((_, index) => (
            <motion.img
              whileHover={{ scale: 1.05 }}
              key={index}
              src={
                index % 2 === 0
                  ? assets.sample_img_1
                  : assets.sample_img_2
              }
              alt={`Sample ${index}`}
              className="w-16 h-16 rounded-md object-cover transform transition duration-300 hover:scale-105"
            />
          ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        animate={{ opacity: 1 }}
        className="mt-2 text-neutral-600"
      >
        Generated images from imagify
      </motion.p>
    </motion.div>
  );
};

export default Header;
