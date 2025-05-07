import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const AlertTriangle = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div 
        className="max-w-md w-full neu-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-full bg-secondary/10">
            <AlertTriangle size={48} className="text-secondary" />
          </div>
          
          <h1 className="text-4xl font-extrabold mb-2">404</h1>
          <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
          
          <p className="mb-8 text-surface-600 dark:text-surface-400">
            Oops! It seems the dots didn't connect to this page. Let's get you back on track.
          </p>
          
          <Link to="/" className="btn btn-primary w-full flex items-center justify-center">
            <HomeIcon size={20} className="mr-2" />
            Return to Home
          </Link>
        </div>
      </motion.div>
      
      <div className="mt-12 relative">
        <div className="grid grid-cols-4 gap-6">
          {Array(16).fill().map((_, i) => (
            <motion.div
              key={i}
              className="grid-dot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-surface-500 dark:text-surface-400 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Connect to home
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;