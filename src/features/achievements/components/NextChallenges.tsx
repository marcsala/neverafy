import React from 'react';

interface Challenge {
  id: string;
  emoji: string;
  title: string;
  progress: string;
}

interface NextChallengesProps {
  challenges: Challenge[];
}

const NextChallenges: React.FC<NextChallengesProps> = ({ challenges }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-3">🎯 Próximos Desafíos</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {challenges.map(challenge => (
          <div key={challenge.id} className="text-center">
            <div className="text-2xl mb-2">{challenge.emoji}</div>
            <p className="font-medium">{challenge.title}</p>
            <p className="text-gray-600">Progreso: {challenge.progress}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextChallenges;