import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const GameController = getIcon('GameController');
  const Users = getIcon('Users');
  const Trophy = getIcon('Trophy');
  const Zap = getIcon('Zap');
  
  const [userName, setUserName] = useState('');
  const [showMainFeature, setShowMainFeature] = useState(false);
  
  const handleStart = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Please enter a username to continue");
      return;
    }
    setShowMainFeature(true);
    toast.success(`Welcome to DotNect, ${userName}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-2 relative">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <motion.div 
                className="absolute top-0 left-0 w-8 h-8 rounded-full"
                initial={{ boxShadow: "0 0 0 0 rgba(83, 131, 237, 0.7)" }}
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(83, 131, 237, 0.7)", "0 0 0 10px rgba(83, 131, 237, 0)"],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  repeatType: "loop"
                }}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">DotNect</h1>
          </div>
        </div>
      </header>
      
      {!showMainFeature ? (
        <div className="flex-grow container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="card mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                Connect The Dots, Claim Your Squares!
              </h2>
              <p className="text-surface-700 dark:text-surface-300 mb-6 text-center md:text-lg">
                DotNect brings the classic paper-and-pencil game online. Connect dots, complete squares, and outplay your opponents!
              </p>
              
              <form onSubmit={handleStart} className="mb-6">
                <div className="mb-4">
                  <label htmlFor="username" className="block mb-2 font-medium text-surface-800 dark:text-surface-200">
                    Enter your username to start
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full btn btn-primary py-3 text-lg font-semibold"
                >
                  Start Playing
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="neu-card flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <GameController size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Strategic Gameplay</h3>
                <p className="text-surface-700 dark:text-surface-300">
                  Plan your moves carefully to claim squares and block opponents.
                </p>
              </div>
              
              <div className="neu-card flex flex-col items-center text-center">
                <div className="p-3 bg-secondary/10 rounded-full mb-4">
                  <Users size={24} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiplayer Fun</h3>
                <p className="text-surface-700 dark:text-surface-300">
                  Play with friends in real-time competitive matches.
                </p>
              </div>
              
              <div className="neu-card flex flex-col items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-4">
                  <Trophy size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Scores</h3>
                <p className="text-surface-700 dark:text-surface-300">
                  See who's leading with our real-time score tracker.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <MainFeature username={userName} />
      )}
      
      <footer className="bg-surface-100 dark:bg-surface-800 py-6 px-4">
        <div className="container mx-auto text-center">
          <p className="text-surface-600 dark:text-surface-400">
            © {new Date().getFullYear()} DotNect - Connect the Dots Game
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;