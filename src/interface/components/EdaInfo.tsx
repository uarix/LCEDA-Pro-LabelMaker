import { Terminal } from 'lucide-react';
import React from 'react';

interface EdaInfoProps {
	version: string;
}

export const EdaInfo: React.FC<EdaInfoProps> = ({ version }) => {
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex items-center gap-3 mb-4">
				<Terminal className="w-6 h-6 text-blue-500" />
				<h2 className="text-xl font-semibold text-gray-900">EDA Information</h2>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
					<span className="text-gray-600 font-medium">Version</span>
					<span className="text-gray-900">{version}</span>
				</div>

				<div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
					<span className="text-gray-600 font-medium">Status</span>
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						Active
					</span>
				</div>
			</div>
		</div>
	);
};
