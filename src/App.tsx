// src/App.tsx


import { TaskProvider } from './context/TaskContext';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './styles/global.css';
import './styles/components.css';

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Header />
        <div className="container">
          <Toolbar />
          <TaskList />
        </div>
        <Footer />
      </div>
    </TaskProvider>
  );
}

export default App;
