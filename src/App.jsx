import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar.jsx';
import { OverviewSection } from './components/sections/OverviewSection.jsx';
import { ArchitectureSection } from './components/sections/ArchitectureSection.jsx';
import { ActivationsSection } from './components/sections/ActivationsSection.jsx';
import { ForwardPropSection } from './components/sections/ForwardPropSection.jsx';
import { TrainingSection } from './components/sections/TrainingSection.jsx';
import { WeightInitSection } from './components/sections/WeightInitSection.jsx';
import { ConceptsSection } from './components/sections/ConceptsSection.jsx';
import { GraduationCap, Github, BookOpen, Heart } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Academic Navigation */}
      <Navbar activeSection={activeSection} onSelectSection={setActiveSection} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeSection === 'overview' && (
          <OverviewSection
            onStartLearning={() => setActiveSection('architecture')}
            onNavigate={(sec) => setActiveSection(sec)}
          />
        )}

        {activeSection === 'architecture' && <ArchitectureSection />}

        {activeSection === 'activations' && <ActivationsSection />}

        {activeSection === 'forward' && <ForwardPropSection />}

        {activeSection === 'training' && <TrainingSection />}

        {activeSection === 'weight-init' && <WeightInitSection />}

        {activeSection === 'concepts' && <ConceptsSection />}
      </main>

      {/* Academic Project Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>
              <strong>Neural Network Learning Lab</strong> • Academic Project for Second-Year B.Tech AIML
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Student: <strong>Madhav Zanwar</strong></span>
            <span>•</span>
            <a
              href="https://github.com/madhavzanwar/neural-project"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span>•</span>
            <a
              href="https://github.com/MrZoller/neural-viz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Adapted from neural-viz (MIT)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
