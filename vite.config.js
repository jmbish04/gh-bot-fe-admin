import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Custom plugin to log all Vite errors and warnings
const loggingPlugin = () => {
  const logFile = path.resolve('./vite-errors.log');
  
  return {
    name: 'vite-logging',
    buildStart() {
      // Clear the log file at the start of each build
      if (fs.existsSync(logFile)) {
        fs.unlinkSync(logFile);
      }
    },
    buildEnd(error) {
      if (error) {
        const logMessage = `[${new Date().toISOString()}] BUILD ERROR: ${error.message}\n${error.stack || ''}\n\n`;
        fs.appendFileSync(logFile, logMessage);
      }
    },
    handleHotUpdate({ file, timestamp }) {
      const logMessage = `[${new Date().toISOString()}] HMR: ${file} updated at ${timestamp}\n`;
      fs.appendFileSync(logFile, logMessage);
    }
  };
};

export default defineConfig({
  plugins: [loggingPlugin()],
  logLevel: 'info',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        const logMessage = `[${new Date().toISOString()}] WARNING: ${warning.message}\nLocation: ${warning.loc?.file}:${warning.loc?.line}:${warning.loc?.column}\n\n`;
        fs.appendFileSync('./vite-errors.log', logMessage);
        warn(warning);
      }
    }
  },
  esbuild: {
    logLevel: 'info',
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  }
});
