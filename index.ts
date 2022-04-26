// Import stylesheets
import './style.css';
import XrScene from './core/xrScene';
import App from './app';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

const scene = new XrScene(appDiv);
