import { Info, RefreshCw, Settings } from 'lucide-react';
import React from 'react';

interface ActionPanelProps {
	onAction: (action: string) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onAction }) => {
	const actions = [
		{
			id: 'getVersion',
			label: 'Get Version',
			icon: <Info className="w-5 h-5" />,
			description: 'Retrieve the current Ext version',
		},
		{
			id: 'getAbout',
			label: 'Get About',
			icon: <RefreshCw className="w-5 h-5" />,
			description: 'Retrieve the current Ext about content',
		},
		{
			id: 'exit',
			label: 'Exit',
			icon: <Settings className="w-5 h-5" />,
			description: 'Exit the Ext',
		},
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">Available Actions</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{actions.map((action) => (
					<button
						key={action.id}
						onClick={() => onAction(action.id)}
						className="flex flex-col items-center p-4 rounded-lg border border-gray-200 
                     hover:border-blue-500 hover:shadow-md transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						<div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">{action.icon}</div>
						<span className="font-medium text-gray-900 mb-1">{action.label}</span>
						<span className="text-sm text-gray-500 text-center">{action.description}</span>
					</button>
				))}
			</div>
		</div>
	);
};
