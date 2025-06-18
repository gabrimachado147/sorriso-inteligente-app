
import React from 'react';

interface ProjectInfo {
  components: number;
  hooks: number;
  pages: number;
  componentList: string[];
  hookList: string[];
  pageList: string[];
}

interface ProjectInfoTabProps {
  projectInfo: ProjectInfo;
}

export const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({ projectInfo }) => {
  return (
    <div className="overflow-visible max-h-none p-4">
      <div className="text-sm text-gray-600 space-y-4">
        <div>
          <p className="font-semibold text-purple-700 mb-2">📊 Estatísticas do Projeto:</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-medium">Componentes React</p>
              <p className="text-2xl font-bold text-blue-600">{projectInfo.components}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="font-medium">Hooks Customizados</p>
              <p className="text-2xl font-bold text-green-600">{projectInfo.hooks}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="font-medium">Páginas/Rotas</p>
              <p className="text-2xl font-bold text-purple-600">{projectInfo.pages}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <p className="font-medium">Tecnologias</p>
              <p className="text-2xl font-bold text-orange-600">7+</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-700 mb-2">🔧 Principais Componentes:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {projectInfo.componentList.map((comp, i) => (
              <p key={i} className="bg-gray-100 p-1 rounded">• {comp}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-700 mb-2">🪝 Hooks Customizados:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {projectInfo.hookList.map((hook, i) => (
              <p key={i} className="bg-gray-100 p-1 rounded">• {hook}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-700 mb-2">🚀 Stack Tecnológico:</p>
          <div className="space-y-1 text-xs">
            <p>• React 18.3.1 com TypeScript</p>
            <p>• Supabase (Backend completo)</p>
            <p>• Tailwind CSS + Shadcn/UI</p>
            <p>• React Query (TanStack)</p>
            <p>• PWA (Progressive Web App)</p>
            <p>• Vite (Build tool moderna)</p>
            <p>• Zustand (State management)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
